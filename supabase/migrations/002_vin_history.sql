-- VIN History Tracking
-- Tracks mileage readings and ownership changes per VIN number
-- Used to detect odometer rollbacks and show ownership history

-- VIN records: one row per unique VIN, aggregates history
CREATE TABLE vin_records (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  vin TEXT NOT NULL UNIQUE,
  make TEXT,
  model TEXT,
  year INTEGER,
  first_seen_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_seen_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  total_owners INTEGER NOT NULL DEFAULT 1,
  has_mileage_anomaly BOOLEAN NOT NULL DEFAULT false
);

-- VIN mileage history: each time a car with this VIN is listed or updated
CREATE TABLE vin_mileage_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  vin TEXT NOT NULL REFERENCES vin_records(vin) ON DELETE CASCADE,
  car_id UUID REFERENCES cars(id) ON DELETE SET NULL,
  recorded_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  mileage INTEGER NOT NULL CHECK (mileage >= 0),
  source TEXT NOT NULL DEFAULT 'listing' CHECK (source IN ('listing', 'update', 'inspection', 'manual')),
  notes TEXT,
  recorded_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- VIN ownership history: tracks each time a car changes hands
CREATE TABLE vin_ownership_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  vin TEXT NOT NULL REFERENCES vin_records(vin) ON DELETE CASCADE,
  car_id UUID REFERENCES cars(id) ON DELETE SET NULL,
  seller_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  seller_type TEXT CHECK (seller_type IN ('particular', 'stand')),
  listed_price NUMERIC(12, 2),
  listed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  sold_at TIMESTAMPTZ
);

-- Indexes
CREATE INDEX idx_vin_records_vin ON vin_records(vin);
CREATE INDEX idx_vin_mileage_vin ON vin_mileage_history(vin);
CREATE INDEX idx_vin_mileage_recorded ON vin_mileage_history(vin, recorded_at DESC);
CREATE INDEX idx_vin_ownership_vin ON vin_ownership_history(vin);

-- RLS
ALTER TABLE vin_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE vin_mileage_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE vin_ownership_history ENABLE ROW LEVEL SECURITY;

-- VIN records: public read (transparency is the point), authenticated insert/update
CREATE POLICY "VIN records are viewable by everyone" ON vin_records FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create VIN records" ON vin_records FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Authenticated users can update VIN records" ON vin_records FOR UPDATE USING (auth.uid() IS NOT NULL);

-- VIN mileage: public read, authenticated insert
CREATE POLICY "VIN mileage history is viewable by everyone" ON vin_mileage_history FOR SELECT USING (true);
CREATE POLICY "Authenticated users can add mileage records" ON vin_mileage_history FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- VIN ownership: public read, authenticated insert
CREATE POLICY "VIN ownership history is viewable by everyone" ON vin_ownership_history FOR SELECT USING (true);
CREATE POLICY "Authenticated users can add ownership records" ON vin_ownership_history FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- Function: auto-record VIN history when a car is inserted with a VIN
CREATE OR REPLACE FUNCTION record_vin_on_car_insert()
RETURNS TRIGGER AS $$
BEGIN
  -- Only process if VIN is provided
  IF NEW.vin IS NOT NULL AND NEW.vin != '' THEN
    -- Upsert VIN record
    INSERT INTO vin_records (vin, make, model, year)
    VALUES (UPPER(TRIM(NEW.vin)), NEW.make, NEW.model, NEW.year)
    ON CONFLICT (vin) DO UPDATE SET
      last_seen_at = NOW(),
      total_owners = vin_records.total_owners + 1,
      make = COALESCE(EXCLUDED.make, vin_records.make),
      model = COALESCE(EXCLUDED.model, vin_records.model),
      year = COALESCE(EXCLUDED.year, vin_records.year);

    -- Record mileage
    INSERT INTO vin_mileage_history (vin, car_id, recorded_by, mileage, source)
    VALUES (UPPER(TRIM(NEW.vin)), NEW.id, NEW.seller_id, NEW.mileage, 'listing');

    -- Record ownership
    INSERT INTO vin_ownership_history (vin, car_id, seller_id, seller_type, listed_price)
    VALUES (
      UPPER(TRIM(NEW.vin)),
      NEW.id,
      NEW.seller_id,
      (SELECT type FROM profiles WHERE id = NEW.seller_id),
      NEW.price
    );

    -- Check for mileage anomaly (lower mileage than previous record)
    IF EXISTS (
      SELECT 1 FROM vin_mileage_history
      WHERE vin = UPPER(TRIM(NEW.vin))
        AND mileage > NEW.mileage
        AND id != (
          SELECT id FROM vin_mileage_history
          WHERE vin = UPPER(TRIM(NEW.vin))
          ORDER BY recorded_at DESC LIMIT 1
        )
    ) THEN
      UPDATE vin_records SET has_mileage_anomaly = true
      WHERE vin = UPPER(TRIM(NEW.vin));
    END IF;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_car_insert_record_vin
  AFTER INSERT ON cars
  FOR EACH ROW EXECUTE FUNCTION record_vin_on_car_insert();

-- Function: auto-record mileage when a car's mileage is updated
CREATE OR REPLACE FUNCTION record_vin_on_car_update()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.vin IS NOT NULL AND NEW.vin != '' AND OLD.mileage != NEW.mileage THEN
    INSERT INTO vin_mileage_history (vin, car_id, recorded_by, mileage, source)
    VALUES (UPPER(TRIM(NEW.vin)), NEW.id, NEW.seller_id, NEW.mileage, 'update');

    UPDATE vin_records SET last_seen_at = NOW() WHERE vin = UPPER(TRIM(NEW.vin));

    -- Check for anomaly
    IF NEW.mileage < OLD.mileage THEN
      UPDATE vin_records SET has_mileage_anomaly = true
      WHERE vin = UPPER(TRIM(NEW.vin));
    END IF;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_car_update_record_vin
  AFTER UPDATE ON cars
  FOR EACH ROW EXECUTE FUNCTION record_vin_on_car_update();
