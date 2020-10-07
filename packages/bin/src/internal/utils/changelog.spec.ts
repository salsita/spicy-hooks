import { buildChangelog } from './changelog'

describe('buildChangelog', () => {
  it('selects matching sections', () => {
    expect(
      buildChangelog(['## OK - Selected', '## NOK - Dropped'], /^## OK - /)
    ).toBe('Selected')
  })

  it('keeps captured groups', () => {
    expect(
      buildChangelog(['## OK - Kept'], /^(## )OK - /)
    ).toBe('## Kept')
  })
})
