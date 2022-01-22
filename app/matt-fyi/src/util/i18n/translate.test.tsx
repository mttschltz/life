import { TranslationProvider, useTranslate } from './translate'
import { renderHook } from '@testing-library/react-hooks'
import React from 'react'

describe('useTranslate', () => {
  describe('Given a TranslationProvider', () => {
    describe('When the translate hook is called with an existing key', () => {
      test('Then the translation is returned', () => {
        const wrapper: React.FC = ({ children }) => <TranslationProvider>{children}</TranslationProvider>
        const { result } = renderHook(
          () => {
            const t = useTranslate('component')
            return t('common:error.not_found')
          },
          { wrapper },
        )
        expect(result.all).toHaveLength(1)
        expect(result.current).toBe('Not found')
      })
    })
    describe('When the translate hook is called with a non-existing key', () => {
      test('Then the translation key is returned', () => {
        const wrapper: React.FC = ({ children }) => <TranslationProvider>{children}</TranslationProvider>
        const { result } = renderHook(
          () => {
            const t = useTranslate('component')
            // @ts-expect-error testing behaviour of missing key
            return t('invalid key')
          },
          { wrapper },
        )
        expect(result.all).toHaveLength(1)
        expect(result.current).toBe('invalid key')
      })
    })
  })
})
