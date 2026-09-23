import CheckIcon from '~icons/solar/check-circle-linear'
import PencilIcon from '~icons/solar/pen-2-linear'
import { useEffect, useRef, useState } from 'react'

import { PageEditorPanel } from '#/components/editor/page-editor-panel'
import {
  type EditorRect,
  type EditorValues,
  type FontBaseline,
  emptyEditorValues,
  getEditableTarget,
  getEditorRect,
  getElementLabel,
  getTypographyElements,
  isContainerElement,
  normalizeCssSize,
  numberFromCss,
  readEditorValues,
} from '#/components/editor/page-editor-utils'
import { Button } from '#/components/ui/button'

const fontFamilyValues: Record<string, string> = {
  inter: "'Inter Variable', sans-serif",
  mono: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
  serif: 'Georgia, Cambria, "Times New Roman", serif',
  system: 'system-ui, sans-serif',
}

export function PageEditor() {
  const [enabled, setEnabled] = useState(false)
  const [hovered, setHovered] = useState<HTMLElement | null>(null)
  const [selected, setSelected] = useState<HTMLElement | null>(null)
  const [hoverRect, setHoverRect] = useState<EditorRect | null>(null)
  const [selectedRect, setSelectedRect] = useState<EditorRect | null>(null)
  const [values, setValues] = useState<EditorValues>(emptyEditorValues)
  const originals = useRef(new Map<HTMLElement, Map<string, string>>())
  const fontBaselines = useRef(new Map<HTMLElement, FontBaseline>())

  useEffect(() => {
    if (!enabled) return

    function handlePointerMove(event: PointerEvent) {
      setHovered(getEditableTarget(event.target))
    }

    function handleClick(event: MouseEvent) {
      const target = getEditableTarget(event.target)
      if (!target) return

      event.preventDefault()
      event.stopPropagation()
      setSelected(target)
      setHovered(null)
      setValues(readEditorValues(target))
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setSelected(null)
        setSelectedRect(null)
      }
    }

    document.addEventListener('pointermove', handlePointerMove, true)
    document.addEventListener('click', handleClick, true)
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('pointermove', handlePointerMove, true)
      document.removeEventListener('click', handleClick, true)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [enabled])

  useEffect(() => {
    if (!enabled) return

    function updateRects() {
      setHoverRect(hovered ? getEditorRect(hovered) : null)
      setSelectedRect(selected ? getEditorRect(selected) : null)
    }

    updateRects()
    window.addEventListener('resize', updateRects)
    document.addEventListener('scroll', updateRects, true)

    const resizeObserver = new ResizeObserver(updateRects)
    if (hovered) resizeObserver.observe(hovered)
    if (selected) resizeObserver.observe(selected)

    return () => {
      window.removeEventListener('resize', updateRects)
      document.removeEventListener('scroll', updateRects, true)
      resizeObserver.disconnect()
    }
  }, [enabled, hovered, selected, values])

  function rememberOriginal(element: HTMLElement, property: string) {
    const properties = originals.current.get(element) ?? new Map<string, string>()
    if (!properties.has(property)) {
      properties.set(property, element.style.getPropertyValue(property))
      originals.current.set(element, properties)
    }
  }

  function setStyle(element: HTMLElement, property: string, value: string) {
    rememberOriginal(element, property)
    element.style.setProperty(property, value)
  }

  function applyTypography(property: string, value: string) {
    if (!selected) return
    getTypographyElements(selected).forEach((element) => setStyle(element, property, value))
  }

  function applyFontSize(value: string) {
    if (!selected) return
    const nextSize = numberFromCss(value, 16)

    if (!isContainerElement(selected)) {
      setStyle(selected, 'font-size', `${nextSize}px`)
      return
    }

    let baseline = fontBaselines.current.get(selected)
    if (!baseline) {
      baseline = {
        elements: getTypographyElements(selected).map((element) => ({
          element,
          size: numberFromCss(getComputedStyle(element).fontSize, 16),
        })),
        referenceSize: numberFromCss(getComputedStyle(selected).fontSize, 16),
      }
      fontBaselines.current.set(selected, baseline)
    }

    const scale = nextSize / baseline.referenceSize
    baseline.elements.forEach(({ element, size }) => {
      setStyle(element, 'font-size', `${Math.round(size * scale * 100) / 100}px`)
    })
  }

  function handleChange(property: keyof EditorValues, value: string) {
    if (!selected) return
    setValues((currentValues) => ({ ...currentValues, [property]: value }))

    if (property === 'color' || property === 'backgroundColor' || property === 'borderColor') {
      if (!CSS.supports('color', value)) return
      if (property === 'color') return applyTypography('color', value)
      if (property === 'backgroundColor') {
        setStyle(selected, 'background-image', 'none')
        return setStyle(selected, 'background-color', value)
      }
      return setStyle(selected, 'border-color', value)
    }

    if (property === 'fontSize') return applyFontSize(value)
    if (property === 'fontWeight') return applyTypography('font-weight', value)
    if (property === 'fontFamily') return applyTypography('font-family', fontFamilyValues[value])
    if (property === 'lineHeight') {
      return applyTypography('line-height', value === 'normal' ? value : normalizeCssSize(value))
    }
    if (property === 'letterSpacing') {
      return applyTypography('letter-spacing', normalizeCssSize(value))
    }

    const cssProperty = property === 'borderRadius' ? 'border-radius' : property
    setStyle(selected, cssProperty, normalizeCssSize(value))
  }

  function restoreElement(element: HTMLElement) {
    const properties = originals.current.get(element)
    if (!properties) return

    properties.forEach((originalValue, property) => {
      if (originalValue) element.style.setProperty(property, originalValue)
      else element.style.removeProperty(property)
    })
    originals.current.delete(element)
  }

  function resetSelected() {
    if (!selected) return
    Array.from(originals.current.keys()).forEach((element) => {
      if (element === selected || selected.contains(element)) restoreElement(element)
    })
    fontBaselines.current.delete(selected)
    setValues(readEditorValues(selected))
  }

  function resetPage() {
    Array.from(originals.current.keys()).forEach(restoreElement)
    fontBaselines.current.clear()
    if (selected) setValues(readEditorValues(selected))
  }

  function selectParent() {
    if (!selected?.parentElement || selected.parentElement === document.body) return
    setSelected(selected.parentElement)
    setValues(readEditorValues(selected.parentElement))
  }

  function toggleEditor() {
    setEnabled((currentValue) => !currentValue)
    setHovered(null)
    setSelected(null)
    setHoverRect(null)
    setSelectedRect(null)
  }

  return (
    <div data-page-editor>
      {enabled && (
        <>
          {hoverRect && hovered !== selected && <EditorOutline rect={hoverRect} variant="hover" />}
          {selectedRect && selected && (
            <EditorOutline
              label={getElementLabel(selected)}
              rect={selectedRect}
              variant="selected"
            />
          )}
          <PageEditorPanel
            canSelectParent={Boolean(
              selected?.parentElement && selected.parentElement !== document.body,
            )}
            isContainer={Boolean(selected && isContainerElement(selected))}
            onChange={handleChange}
            onResetElement={resetSelected}
            onResetPage={resetPage}
            onSelectParent={selectParent}
            selectedLabel={selected ? getElementLabel(selected) : null}
            values={values}
          />
        </>
      )}

      <Button
        aria-pressed={enabled}
        className="fixed right-4 bottom-4 z-10000 rounded-full px-4 shadow-lg"
        onClick={toggleEditor}
        size="lg"
      >
        {enabled ? <CheckIcon data-icon="inline-start" /> : <PencilIcon data-icon="inline-start" />}
        {enabled ? 'Done' : 'Edit page'}
      </Button>
    </div>
  )
}

interface EditorOutlineProps {
  label?: string
  rect: EditorRect
  variant: 'hover' | 'selected'
}

function EditorOutline({ label, rect, variant }: EditorOutlineProps) {
  return (
    <div
      className={
        variant === 'selected'
          ? 'pointer-events-none fixed z-9998 border-2 border-foreground'
          : 'pointer-events-none fixed z-9997 border border-dashed border-foreground/45'
      }
      style={{ height: rect.height, left: rect.left, top: rect.top, width: rect.width }}
    >
      {label && (
        <span className="absolute -top-6 left-0 rounded-t-md bg-foreground px-2 py-1 font-mono text-[10px] leading-4 text-background">
          {label}
        </span>
      )}
    </div>
  )
}
