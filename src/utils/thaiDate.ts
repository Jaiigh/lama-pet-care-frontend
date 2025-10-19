import dayjs, { Dayjs } from 'dayjs';
import 'dayjs/locale/th';
import buddhistEra from 'dayjs/plugin/buddhistEra';

dayjs.extend(buddhistEra);
dayjs.locale('th');

export const formatToThaiBuddhistDate = (date: Dayjs): string => {
  return date.format('MMMM BBBB');
};

export const thaiDayShortNames = ['อา', 'จ', 'อ', 'พ', 'พฤ', 'ศ', 'ส'];

