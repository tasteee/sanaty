export type ConditionT<S> = S | { and: ConditionT<S>[] } | { or: ConditionT<S>[] } | { not: ConditionT<S> }
export type StringifyFnT = (value: unknown, key: string) => string | null
export type SelectorT = `${string}&${string}` | `@${'media' | 'container' | 'supports'} ${string}`
export type EnhanceStyleFn<CSSProperties> = (style: CSSProperties) => CSSProperties

export interface CreateHooksResult<S, CSSProperties> {
  on: (condition: ConditionT<S>, style: CSSProperties) => EnhanceStyleFn<CSSProperties>
  and: <C extends ConditionT<S>[]>(...conditions: C) => { and: C }
  or: <C extends ConditionT<S>[]>(...conditions: C) => { or: C }
  not: <C extends ConditionT<S>>(condition: C) => { not: C }
  styleSheet: () => string
}

export type CreateStylesFnT<CSSPropertiesT> = (...selectors: SelectorT[]) => CreateHooksResult<SelectorT, CSSPropertiesT>

type AnyObjectT = { [key: string]: any }
type StringValuesObjectT = Record<string, string>
type BuildExpressionReturnT = [string, StringValuesObjectT]

const IS_DEV_ENV = process.env.NODE_ENV === 'developement'
const [SPACE, NEW_LINE] = IS_DEV_ENV ? [' ', '\n'] : ['', '']
const INDENT = Array(2).fill(SPACE).join('')

export const createStyles = <CSSPropertiesT extends AnyObjectT>(...selectors: string[]): CreateHooksResult<SelectorT, CSSPropertiesT> => {
  const styleSheet = () => {
    const flatMapped0 = selectors.flatMap((selector) => [
      `${INDENT}--${createHash(selector)}-0:${SPACE}initial;`,
      `${INDENT}--${createHash(selector)}-1:${SPACE};`
    ])

    const flatMapped1 = selectors.flatMap((def) => {
      if (def.startsWith('@')) {
        return [
          `${def} {`,
          `${INDENT}* {`,
          `${INDENT}${INDENT}--${createHash(def)}-0:${SPACE};`,
          `${INDENT}${INDENT}--${createHash(def)}-1:${SPACE}initial;`,
          `${INDENT}}`,
          '}'
        ]
      }
      return [
        `${def.replace(/&/g, '*')}${SPACE}{`,
        `${INDENT}--${createHash(def)}-0:${SPACE};`,
        `${INDENT}--${createHash(def)}-1:${SPACE}initial;`,
        '}'
      ]
    })

    const part0 = flatMapped0.join(NEW_LINE)
    const part1 = flatMapped1.join(NEW_LINE)
    return `*${SPACE}{${NEW_LINE}${part0}${NEW_LINE}}${NEW_LINE}${part1}`
  }

  const on = (condition, conditionalStyle) => {
    return (fallbackStyle) => {
      const style = { ...fallbackStyle }

      for (const property in conditionalStyle) {
        let fallbackValue = 'revert-layer'

        const conditionalValue = stringify(conditionalStyle[property], property)
        if (conditionalValue === null) continue

        if (property in style) {
          const fv = stringify(style[property], property)
          if (fv !== null) {
            fallbackValue = fv
          }
        }

        const [value, extraDecls] = buildExpression(condition, conditionalValue, fallbackValue)
        Object.assign(style, { [property]: value }, extraDecls)
      }

      return style
    }
  }

  return {
    on,
    styleSheet,
    and: (...and) => ({ and }),
    or: (...or) => ({ or }),
    not: (not) => ({ not })
  }
}

function stringify(value: unknown, propertyName: string) {
  switch (typeof value) {
    case 'string':
      return value
    case 'number':
      return `${value}${isUnitlessNumber(propertyName) ? '' : 'px'}`
    default:
      return null
  }
}

const unitlessNumbers = new Set([
  'animationIterationCount',
  'aspectRatio',
  'borderImageOutset',
  'borderImageSlice',
  'borderImageWidth',
  'boxFlex',
  'boxFlexGroup',
  'boxOrdinalGroup',
  'columnCount',
  'columns',
  'flex',
  'flexGrow',
  'flexPositive',
  'flexShrink',
  'flexNegative',
  'flexOrder',
  'gridArea',
  'gridRow',
  'gridRowEnd',
  'gridRowSpan',
  'gridRowStart',
  'gridColumn',
  'gridColumnEnd',
  'gridColumnSpan',
  'gridColumnStart',
  'fontWeight',
  'lineClamp',
  'lineHeight',
  'opacity',
  'order',
  'orphans',
  'scale',
  'tabSize',
  'widows',
  'zIndex',
  'zoom',
  'fillOpacity' /* SVG-related properties*/,
  'floodOpacity',
  'stopOpacity',
  'strokeDasharray',
  'strokeDashoffset',
  'strokeMiterlimit',
  'strokeOpacity',
  'strokeWidth',
  'MozAnimationIterationCount' /* Known Prefixed Properties*/,
  'MozBoxFlex' /* TODO: Remove these since they shouldn't be used in modern code*/,
  'MozBoxFlexGroup',
  'MozLineClamp',
  'msAnimationIterationCount',
  'msFlex',
  'msZoom',
  'msFlexGrow',
  'msFlexNegative',
  'msFlexOrder',
  'msFlexPositive',
  'msFlexShrink',
  'msGridColumn',
  'msGridColumnSpan',
  'msGridRow',
  'msGridRowSpan',
  'WebkitAnimationIterationCount',
  'WebkitBoxFlex',
  'WebKitBoxFlexGroup',
  'WebkitBoxOrdinalGroup',
  'WebkitColumnCount',
  'WebkitColumns',
  'WebkitFlex',
  'WebkitFlexGrow',
  'WebkitFlexPositive',
  'WebkitFlexShrink',
  'WebkitLineClamp'
])

function isUnitlessNumber(name: string) {
  return /^--/.test(name) || unitlessNumbers.has(name)
}

function buildExpression(condition: string | ConditionT<string>, valueIfTrue: string, valueIfFalse: string): BuildExpressionReturnT {
  const isConditionString = typeof condition === 'string'
  const isTrueValueLong = valueIfTrue.length > 32
  const isFalseValueLong = valueIfFalse.length > 32

  if (isConditionString) {
    const conditionHash0 = createHash(condition)
    const conditionHash1 = createHash(condition)
    const extraDeclarations: StringValuesObjectT = {}
    let valTrue = valueIfTrue
    let valFalse = valueIfFalse

    if (isTrueValueLong) {
      const hash = createHash(valTrue)
      extraDeclarations[`--${hash}`] = valTrue
      valTrue = `var(--${hash})`
    }

    if (isFalseValueLong) {
      const hash = createHash(valFalse)
      extraDeclarations[`--${hash}`] = valFalse
      valFalse = `var(--${hash})`
    }

    const firstVar = `var(--${conditionHash0}-1,${SPACE}${valTrue})`
    const secondVar = `var(--${conditionHash1}-0,${SPACE}${valFalse})`
    return [`${firstVar}${SPACE}${secondVar}`, extraDeclarations]
  }

  if ('and' in condition) {
    const [head, ...tail] = condition.and
    if (!head) return [valueIfTrue, {}]
    if (tail.length === 0) return buildExpression(head, valueIfTrue, valueIfFalse)
    const [tailExpr, tailDecls] = buildExpression({ and: tail }, valueIfTrue, valueIfFalse)
    const [expression, declarations] = buildExpression(head, tailExpr, valueIfFalse)
    return [expression, { ...declarations, ...tailDecls }]
  }

  if ('or' in condition) return buildExpression({ and: condition.or.map((not) => ({ not })) }, valueIfFalse, valueIfTrue)
  if (condition.not) return buildExpression(condition.not, valueIfFalse, valueIfTrue)
  throw new Error(`Invalid condition: ${JSON.stringify(condition)}`)
}

const createHash = (target: unknown) => {
  const stringified = JSON.stringify(target)
  let hashValue = 0

  for (let index = 0; index < stringified.length; index++) {
    const charCode = stringified.charCodeAt(index)
    hashValue = (hashValue << 5) - hashValue + charCode
    hashValue &= 0x7fffffff
  }

  const str = hashValue.toString(36)
  return /^[0-9]/.test(str) ? `a${str}` : str
}
