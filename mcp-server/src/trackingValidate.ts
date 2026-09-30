/** Diagnose retired tracking files. Current project records live in appledger/. */
export type TrackingValidationResult = { issues: string[]; warnings: string[] };

export function validateTrackingData(data: Record<string, unknown>): TrackingValidationResult {
  if (!data || typeof data !== 'object' || Array.isArray(data)) {
    return { issues: ['Tracking data is empty or not an object.'], warnings: [] };
  }
  if (data.status === 'pointer' && typeof data.record === 'string' && data.record.replaceAll('\\', '/').includes('appledger')) {
    return { issues: [], warnings: ["This file is a pointer to appledger/. Do not add decisions, sessions, or phase status here."] };
  }
  return { issues: ["Legacy writable tracking is not the system of record. Legacy migration is retired. Preserve the file; historical recovery uses an isolated copy and AppLedger commit fb7939c0f4d811930adb9cfd4bfd0c6766638a44. Write current decisions, sessions, and phase only in appledger/."], warnings: [] };
}

export function formatValidationResult(result: TrackingValidationResult): string {
  if (result.issues.length === 0 && result.warnings.length === 0) {
    return 'No workflow_tracking.json is required. Project state lives in appledger/.';
  }
  if (result.issues.length === 0) {
    return 'Pointer accepted. Project state lives in appledger/.\n\n' + result.warnings.map(item => '- ' + item).join('\n');
  }
  return 'Issues (fix these):\n' + result.issues.map(item => '- ' + item).join('\n');
}
