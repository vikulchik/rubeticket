export class DateUtils {
  static formatToDateOnly(dateStr: string): string {
    if (!dateStr.includes('T')) {
      return new Date(dateStr).toISOString().split('T')[0];
    }
    return dateStr.split('T')[0];
  }
}
