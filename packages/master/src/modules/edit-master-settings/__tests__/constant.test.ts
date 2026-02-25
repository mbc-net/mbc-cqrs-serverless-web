import { statusLabelMap, statusClassMap } from '../constant'

describe('edit-master-settings/constant', () => {
  const allStatuses = [
    'CREATED',
    'QUEUED',
    'PROCESSING',
    'STARTED',
    'FINISHED',
    'COMPLETED',
    'ERRORED',
    'FAILED',
  ]

  describe('statusLabelMap', () => {
    it.each(allStatuses)('%s should have a label defined', (status) => {
      expect(statusLabelMap[status]).toBeDefined()
      expect(typeof statusLabelMap[status]).toBe('string')
      expect(statusLabelMap[status].length).toBeGreaterThan(0)
    })

    it('should have 8 statuses defined', () => {
      expect(Object.keys(statusLabelMap)).toHaveLength(8)
    })
  })

  describe('statusClassMap', () => {
    it.each(allStatuses)('%s should have a CSS class defined', (status) => {
      expect(statusClassMap[status]).toBeDefined()
      expect(typeof statusClassMap[status]).toBe('string')
      expect(statusClassMap[status].length).toBeGreaterThan(0)
    })

    it('should have 8 statuses defined', () => {
      expect(Object.keys(statusClassMap)).toHaveLength(8)
    })
  })

  it('statusLabelMap and statusClassMap should have matching keys', () => {
    const labelKeys = Object.keys(statusLabelMap).sort()
    const classKeys = Object.keys(statusClassMap).sort()
    expect(labelKeys).toEqual(classKeys)
  })
})
