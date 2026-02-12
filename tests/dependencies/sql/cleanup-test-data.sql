-- Cleanup Test Data
-- Deletes all submissions and field_outputs for test user
-- WARNING: This will permanently delete test data. Use with caution.

-- Test user UUID
DO $$
DECLARE
    v_test_user_id UUID := '5dc6b5ac-b69d-432f-a4b3-f5cd445fc4ad';
    v_deleted_count INT := 0;
BEGIN
    -- Sprint 00: WOOP
    DELETE FROM sprint_00_woop.field_outputs
    WHERE submission_id IN (SELECT id FROM sprint_00_woop.submissions WHERE user_id = v_test_user_id);
    DELETE FROM sprint_00_woop.submissions WHERE user_id = v_test_user_id;
    GET DIAGNOSTICS v_deleted_count = ROW_COUNT;
    RAISE NOTICE 'sprint_00_woop: Deleted % submissions', v_deleted_count;

    -- Sprint 01: Know Thyself
    DELETE FROM sprint_01_know_thyself.field_outputs
    WHERE submission_id IN (SELECT id FROM sprint_01_know_thyself.submissions WHERE user_id = v_test_user_id);
    DELETE FROM sprint_01_know_thyself.submissions WHERE user_id = v_test_user_id;
    GET DIAGNOSTICS v_deleted_count = ROW_COUNT;
    RAISE NOTICE 'sprint_01_know_thyself: Deleted % submissions', v_deleted_count;

    -- Sprint 02: Dream
    DELETE FROM sprint_02_dream.field_outputs
    WHERE submission_id IN (SELECT id FROM sprint_02_dream.submissions WHERE user_id = v_test_user_id);
    DELETE FROM sprint_02_dream.submissions WHERE user_id = v_test_user_id;
    GET DIAGNOSTICS v_deleted_count = ROW_COUNT;
    RAISE NOTICE 'sprint_02_dream: Deleted % submissions', v_deleted_count;

    -- Sprint 03: Values
    DELETE FROM sprint_03_values.field_outputs
    WHERE submission_id IN (SELECT id FROM sprint_03_values.submissions WHERE user_id = v_test_user_id);
    DELETE FROM sprint_03_values.submissions WHERE user_id = v_test_user_id;
    GET DIAGNOSTICS v_deleted_count = ROW_COUNT;
    RAISE NOTICE 'sprint_03_values: Deleted % submissions', v_deleted_count;

    -- Sprint 04: Team
    DELETE FROM sprint_04_team.field_outputs
    WHERE submission_id IN (SELECT id FROM sprint_04_team.submissions WHERE user_id = v_test_user_id);
    DELETE FROM sprint_04_team.submissions WHERE user_id = v_test_user_id;
    GET DIAGNOSTICS v_deleted_count = ROW_COUNT;
    RAISE NOTICE 'sprint_04_team: Deleted % submissions', v_deleted_count;

    -- Sprint 05: Goals
    DELETE FROM sprint_05_goals.field_outputs
    WHERE submission_id IN (SELECT id FROM sprint_05_goals.submissions WHERE user_id = v_test_user_id);
    DELETE FROM sprint_05_goals.submissions WHERE user_id = v_test_user_id;
    GET DIAGNOSTICS v_deleted_count = ROW_COUNT;
    RAISE NOTICE 'sprint_05_goals: Deleted % submissions', v_deleted_count;

    -- Add more schemas as needed...

    -- Clean up user progress
    DELETE FROM shared.user_progress WHERE user_id = v_test_user_id;
    GET DIAGNOSTICS v_deleted_count = ROW_COUNT;
    RAISE NOTICE 'shared.user_progress: Deleted % rows', v_deleted_count;

    RAISE NOTICE 'Cleanup complete for test user: %', v_test_user_id;
END $$;
