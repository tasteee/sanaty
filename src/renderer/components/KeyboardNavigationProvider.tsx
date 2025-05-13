import { KeyboardEvent, useEffect } from 'react'
import { $ui } from '#/stores/ui.store'
import { $search } from '#/stores/search.store'
import React from 'react'

function checkIsTargetAnInput(event) {
  const target = event.target as HTMLElement

  return (
    target.className.includes('chakra-select') ||
    target.className.includes('chakra-input') ||
    target.className.includes('chakra-switch') ||
    target.tagName === 'INPUT' ||
    target.tagName === 'SELECT' ||
    target.tagName === 'TEXTAREA' ||
    target.isContentEditable
  )
}

export const useKeyboardNavigation = () => {
  useEffect(() => {
    console.log('adding event listener...')

    const handleKeyDown = (event) => {
      console.log('handle key down', event.key, event)
      const isTargetAnInput = checkIsTargetAnInput(event)
      if (isTargetAnInput) return

      const key = event.key
      const isArrowDown = key === 'ArrowDown'
      const isArrowUp = key === 'ArrowUp'

      if (isArrowDown || isArrowUp) {
        event.preventDefault()

        const allResults = $search.results.state.all
        const currentActiveIndex = $ui.activeAssetIndex.state
        const currentPage = $search.pagination.state.currentPage
        const totalPages = $search.pagination.state.totalPages
        const itemsPerPage = $search.pagination.state.itemsPerPage
        const firstIndexOnPage = (currentPage - 1) * itemsPerPage
        const lastIndexOnPage = Math.min(firstIndexOnPage + itemsPerPage - 1, allResults.length - 1)
        let newIndex = currentActiveIndex

        if (isArrowDown) {
          // If no active item, select the first item on current page
          if (currentActiveIndex === -1) {
            newIndex = firstIndexOnPage
          }
          // If at the last item on the page and not on the last page, go to next page
          else if (currentActiveIndex === lastIndexOnPage && currentPage < totalPages) {
            $search.goToNextPage()
            newIndex = firstIndexOnPage + itemsPerPage // First item on next page
          }
          // If not at the end of results, go to next item
          else if (currentActiveIndex < allResults.length - 1) {
            newIndex = currentActiveIndex + 1
          }
        } else if (isArrowUp) {
          // If at the first item on the page and not on the first page, go to previous page
          if (currentActiveIndex === firstIndexOnPage && currentPage > 1) {
            $search.goToPreviousPage()
            // Set to last item on previous page
            newIndex = firstIndexOnPage - 1
          }
          // If not at the beginning of results, go to previous item
          else if (currentActiveIndex > 0) {
            newIndex = currentActiveIndex - 1
          }
        }

        // Update active asset if the index changed
        if (newIndex !== currentActiveIndex) {
          $ui.setActiveSampleIndex(newIndex)
          const activeSample = allResults[newIndex]

          if (activeSample) {
            $ui.setActiveSampleId(activeSample.id)
            // Play the sample audio
            playSample(activeSample)
          }
        }
      }
    }

    const playSample = (sample) => {
      $ui.isPlayingSound.set(true)

      // TODO: Here you would implement actual audio playback
      // This is a placeholder for your audio playback implementation
      console.log('Playing sample:', sample.name)
      // Simulate audio completion after sample duration
      const duration = sample.duration * 1000 // Convert seconds to milliseconds

      setTimeout(() => {
        $ui.isPlayingSound.set(false)
      }, duration || 3000)
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      console.log('removing event listener....')
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [])
}

function useActiveSampleScrollTo() {
  const activeSampleId = $ui.activeSampleId.use()

  React.useEffect(() => {
    // if (!activeSampleId) return

    // const element = document.querySelector(`[data-sampleid="${activeSampleId}"]`)
    // if (!element) return

    // element.scrollIntoView({
    //   block: 'nearest',
    //   inline: 'nearest',
    //   behavior: 'smooth'
    // })

    if (!activeSampleId) return

    const element = document.querySelector(`[data-sampleid="${activeSampleId}"]`)
    if (!element) return

    // Find the scrollable parent
    const scrollParent = getScrollParent(element)

    if (scrollParent) {
      // Calculate position to scroll to
      const elementRect = element.getBoundingClientRect()
      const parentRect = scrollParent.getBoundingClientRect()
      // Calculate the relative position of the element within the scroll parent
      const relativeTop = elementRect.top - parentRect.top
      const relativeBottom = elementRect.bottom - parentRect.top

      // Determine if element is already fully visible
      const isFullyVisible = relativeTop >= 0 && relativeBottom <= parentRect.height

      if (!isFullyVisible) {
        // Adjust scroll position to show the element
        // You can choose different scrolling behaviors:

        // Option 1: Scroll to make the element's top align with the container's top
        // scrollParent.scrollTop += relativeTop

        // Option 2: Center the element in the viewport
        scrollParent.scrollTop += relativeTop - (parentRect.height - elementRect.height) / 2

        // // Option 3: Minimal scrolling - only scroll enough to make the element fully visible
        // if (relativeTop < 0) {
        //   scrollParent.scrollTop += relativeTop
        // } else if (relativeBottom > parentRect.height) {
        //   // Element is below viewport, scroll down
        //   scrollParent.scrollTop += relativeBottom - parentRect.height
        // }
      }
    }
  }, [activeSampleId])
}

// Helper function to find the first scrollable parent
function getScrollParent(element) {
  if (!element) return null

  const style = window.getComputedStyle(element)
  const overflowY = style.getPropertyValue('overflow-y')

  if (element.tagName === 'BODY') return window

  if (overflowY === 'auto' || overflowY === 'scroll') {
    return element
  }

  return getScrollParent(element.parentElement)
}

export const KeyboardNavigationProvider = ({ children }) => {
  useKeyboardNavigation()
  useActiveSampleScrollTo()
  return children
}
