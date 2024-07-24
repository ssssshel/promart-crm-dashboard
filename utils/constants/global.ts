export const VALID_STATUS_TRANSITIONS = {
  prospect: ['active'],
  active: ['inactive'],
  inactive: ['active', 'locked'],
  locked: ['active']
};


// Define STATUS_CODES con claves de tipo StatusKey
export const STATUS_CODES: Record<string, number> = {
  prospect: 1,
  active: 2,
  inactive: 3,
  locked: 4
}