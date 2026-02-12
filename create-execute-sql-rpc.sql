-- Create execute_sql RPC function for test queries
CREATE OR REPLACE FUNCTION public.execute_sql(query TEXT)
RETURNS JSONB AS $$
DECLARE
    result JSONB;
BEGIN
    -- This is a simple wrapper that executes raw SQL
    -- Security: Only grant to authenticated users who need it
    EXECUTE 'SELECT jsonb_agg(row_to_json(t)) FROM (' || query || ') t' INTO result;
    RETURN COALESCE(result, '[]'::jsonb);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute to anon for testing (restrict in production!)
GRANT EXECUTE ON FUNCTION public.execute_sql(TEXT) TO anon;
