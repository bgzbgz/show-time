-- Field Outputs Schema Check
-- Verifies that field_outputs tables have correct structure across all schemas

-- Check sprint_00_woop
SELECT
    'sprint_00_woop' as schema_name,
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns
WHERE table_schema = 'sprint_00_woop'
  AND table_name = 'field_outputs'
ORDER BY ordinal_position;

-- Check sprint_01_know_thyself
SELECT
    'sprint_01_know_thyself' as schema_name,
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns
WHERE table_schema = 'sprint_01_know_thyself'
  AND table_name = 'field_outputs'
ORDER BY ordinal_position;

-- Check sprint_02_dream
SELECT
    'sprint_02_dream' as schema_name,
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns
WHERE table_schema = 'sprint_02_dream'
  AND table_name = 'field_outputs'
ORDER BY ordinal_position;

-- Verify indexes exist
SELECT
    schemaname,
    tablename,
    indexname,
    indexdef
FROM pg_indexes
WHERE schemaname IN ('sprint_00_woop', 'sprint_01_know_thyself', 'sprint_02_dream')
  AND tablename = 'field_outputs'
ORDER BY schemaname, indexname;

-- Verify foreign key constraints
SELECT
    tc.table_schema,
    tc.table_name,
    kcu.column_name,
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
  ON tc.constraint_name = kcu.constraint_name
  AND tc.table_schema = kcu.table_schema
JOIN information_schema.constraint_column_usage AS ccu
  ON ccu.constraint_name = tc.constraint_name
  AND ccu.table_schema = tc.table_schema
WHERE tc.constraint_type = 'FOREIGN KEY'
  AND tc.table_schema IN ('sprint_00_woop', 'sprint_01_know_thyself', 'sprint_02_dream')
  AND tc.table_name = 'field_outputs'
ORDER BY tc.table_schema;
