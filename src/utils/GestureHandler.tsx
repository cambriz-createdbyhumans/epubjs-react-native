import React from "react"
import { DimensionValue, I18nManager, Platform, View } from "react-native"
import {
	GestureHandlerRootView,
	GestureDetector,
	Gesture,
	Directions,
} from "react-native-gesture-handler"

interface Props {
	width?: DimensionValue
	height?: DimensionValue
	onSingleTap: () => void
	onDoubleTap: () => void
	onSwipeLeft: () => void
	onSwipeRight: () => void
	onSwipeUp: () => void
	onSwipeDown: () => void
	onLongPress: () => void
	children: React.ReactNode
}

export function GestureHandler({
	width = "100%",
	height = "100%",
	onSingleTap,
	onDoubleTap,
	onSwipeLeft,
	onSwipeRight,
	onSwipeUp,
	onSwipeDown,
	onLongPress,
	children,
}: Props) {
	const singleTap = Gesture.Tap().runOnJS(true).maxDuration(250).onStart(onSingleTap)

	const doubleTap = Gesture.Tap()
		.runOnJS(true)
		.maxDuration(250)
		.numberOfTaps(2)
		.onStart(onDoubleTap)

	const longPress = Gesture.LongPress().runOnJS(true).onStart(onLongPress)

	const swipeLeft = Gesture.Fling()
		.runOnJS(true)
		.direction(I18nManager.isRTL ? Directions.RIGHT : Directions.LEFT)
		.onStart(onSwipeLeft)

	const swipeRight = Gesture.Fling()
		.runOnJS(true)
		.direction(I18nManager.isRTL ? Directions.LEFT : Directions.RIGHT)
		.onStart(onSwipeRight)

	const swipeUp = Gesture.Fling().runOnJS(true).direction(Directions.UP).onStart(onSwipeUp)

	const swipeDown = Gesture.Fling().runOnJS(true).direction(Directions.DOWN).onStart(onSwipeDown)

	if (Platform.OS === "ios") {
		// On iOS, only horizontal swipes are wired to app behavior (pagination).
		// LongPress/DoubleTap/SingleTap and vertical Flings here used to compete
		// with WebKit's native text-selection long-press inside the WebView,
		// which intermittently swallowed selection. Native single-tap is
		// delivered via the WebView's onSingleTap callback; native double-tap
		// is suppressed in RNCWebViewDoubleTapSuppression.m; long-press for
		// text selection is owned by WebKit.
		return (
			<GestureHandlerRootView style={{ flex: 1 }}>
				<GestureDetector gesture={Gesture.Exclusive(swipeLeft, swipeRight)}>
					<View style={{ width, height }}>{children}</View>
				</GestureDetector>
			</GestureHandlerRootView>
		)
	}
	return (
		<GestureHandlerRootView style={{ flex: 1 }}>
			<GestureDetector
				gesture={Gesture.Exclusive(
					swipeLeft,
					swipeRight,
					swipeUp,
					swipeDown,
					longPress,
					doubleTap,
					singleTap,
				)}
			>
				<View style={{ width, height }}>{children}</View>
			</GestureDetector>
		</GestureHandlerRootView>
	)
}
