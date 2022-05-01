import { isDefined } from '../../../src/utils/type_guards'

describe('utils > type_guards', () => {
    describe('isDefined', () => {
        it('should test if a value is defined', () => {
            expect(isDefined(null)).toBeFalsy()
            expect(isDefined(undefined)).toBeFalsy()
            expect(isDefined(2)).toBeTruthy()
        })
    })
})
