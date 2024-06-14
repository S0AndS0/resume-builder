'use strict';

/**
 *
 */
export async function dateDifference({
  left,
  right,
}: {
  left: string | Date;
  right: string | Date;
}): Promise<string> {
  const [left_date, right_date] = [left, right].map((input) => {
    if (input.toString().toLowerCase() === 'now') {
      return new Date();
    }
    return new Date(input);
  });

  const milliseconds = Math.abs(left_date.valueOf() - right_date.valueOf());
  const seconds = milliseconds / 1000;
  const minutes = seconds / 60;
  const hours = minutes / 60;
  const days = hours / 24;
  const weeks = days / 7;
  const years = days / 365;
  const months = years / 12;

  const result = {
    value: Math.floor(years),
    label: 'years',
    operator: '',
  };

  if (result['value'] < 1 && months > 0) {
    result['value'] = Math.floor(months);
    result['label'] = 'months';
    if (months > result['value']) {
      result['operator'] = '+';
    }
  }
  if (years > result['value']) {
    result['operator'] = '+';
  }

  if (result['value'] < 1 && weeks > 0) {
    result['value'] = Math.floor(weeks);
    result['label'] = 'weeks';
    if (weeks > result['value']) {
      result['operator'] = '+';
    }
  }

  if (result['value'] < 1) {
    throw new Error('Insufficent difference detected!');
  } else if (result['value'] === 1 && !result['operator']) {
    result['label'] = [...result['label']].splice(0, result['label'].length - 1).join('');
  }

  return `${result['value']}${result['operator']} ${result['label']}`;
}
