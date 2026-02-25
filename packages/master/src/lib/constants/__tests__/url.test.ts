import { BaseUrlProvider } from '../url'

describe('BaseUrlProvider', () => {
  it('should construct URLs with segment', () => {
    const provider = new BaseUrlProvider('members/v3/jcci')

    expect(provider.SETTINGS_PAGE_URL).toBe('/members/v3/jcci/master-setting')
    expect(provider.ADD_SETTINGS_PAGE_URL).toBe(
      '/members/v3/jcci/master-setting/new'
    )
    expect(provider.DATA_PAGE_URL).toBe('/members/v3/jcci/master-data')
    expect(provider.ADD_DATA_PAGE_URL).toBe('/members/v3/jcci/master-data/new')
    expect(provider.FAQ_CATEGORY_PAGE_URL).toBe('/members/v3/jcci/faq-category')
    expect(provider.TOP_URL).toBe('/members')
  })

  it('should construct URLs with empty segment', () => {
    const provider = new BaseUrlProvider()

    expect(provider.SETTINGS_PAGE_URL).toBe('/master-setting')
    expect(provider.DATA_PAGE_URL).toBe('/master-data')
  })

  it('should generate copy setting page URL', () => {
    const provider = new BaseUrlProvider('app')
    expect(provider.getCopySettingPageUrl('123')).toBe(
      '/app/master-setting/123/copy/new'
    )
  })

  it('should generate detailed copy setting page URL', () => {
    const provider = new BaseUrlProvider('app')
    expect(provider.getDetailedCopySettingPageUrl('123')).toBe(
      '/app/master-setting/123/copy'
    )
  })
})
