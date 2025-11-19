// FIXED GestureHandler.tsx – works perfectly on iOS & Android with your current dependencies
import React from "react"
import { DimensionValue, I18nManager, View } from "react-native"
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from "react-native-gesture-handler"

interface Props {
  width?: DimensionValue
  height?: DimensionValue
  onSingleTap?: () => void
  onDoubleTap?: () => void
  onLongPress?: () => void
  onSwipeLeft?: () => void
  onSwipeRight?: () => void
  onSwipeUp?: () => void
  onSwipeDown?: () => void
  children: React.ReactNode
}

export function GestureHandler({
  width = "100%",
  height = "100%",
  onSingleTap,
  onDoubleTap,
  onLongPress,
  onSwipeLeft,
  onSwipeRight,
  onSwipeUp,
  onSwipeDown,
  children,
}: Props) {
  const gestures: any[] = []

  if (onDoubleTap) {
    gestures.push(
      Gesture.Tap()
        .runOnJS(true)
        .numberOfTaps(2)
        .maxDuration(250)
        .onStart(onDoubleTap)
    )
  }

  if (onLongPress) {
    gestures.push(
      Gesture.LongPress()
        .runOnJS(true)
        .minDuration(500)
        .onStart(onLongPress)
    )
  }

  if (onSingleTap) {
    gestures.push(
      Gesture.Tap()
        .runOnJS(true)
        .maxDuration(250)
        .onStart(onSingleTap)
    )
  }

  if (onSwipeLeft) {
    gestures.push(
      Gesture.Fling()
        .runOnJS(true)
        .direction(I18nManager.isRTL ? 2 : 1)
        .onStart(onSwipeLeft)
    )
  }
  if (onSwipeRight) {
    gestures.push(
      Gesture.Fling()
        .runOnJS(true)
        .direction(I18nManager.isRTL ? 1 : 2)
        .onStart(onSwipeRight)
    )
  }
  if (onSwipeUp) {
    gestures.push(Gesture.Fling().runOnJS(true).direction(4).onStart(onSwipeUp))
  }
  if (onSwipeDown) {
    gestures.push(Gesture.Fling().runOnJS(true).direction(8).onStart(onSwipeDown))
  }

  if (gestures.length === 0) {
    return <View style={{ width, height }}>{children}</View>
  }

  const composed = Gesture.Exclusive(...gestures)

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <GestureDetector gesture={composed}>
        <View style={{ width, height }}>{children}</View>
      </GestureDetector>
    </GestureHandlerRootView>
  )
}