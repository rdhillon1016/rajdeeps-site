---
title: 'The CSS Pixel'
pubDate: 2024-12-19 05:30:00 -8
description: 'An explanation of the physical size of a CSS pixel, and its relation to other CSS units.'
---
# The CSS Pixel

As I was developing responsive frontend applications with the aid of Chrome DevTools' device toolbar (to simulate mobile devices), one question popped into my mind: Why does the simulated mobile device look bigger in physical size on my computer monitor than it actually is in reality? I mean, an iPhone SE definitely isn't 17cm x 10cm in real life, so why am I seeing this zoomed-in version on my monitor?

A cursory search on Google would tell you a CSS pixel is 1/96 of an inch. So, the simulated iPhone SE on my monitor should've been true to size, right? Well, the truth is that a CSS pixel often isn't 1/96 inch, and sources that tell such you such are leaving out a lot of context.

## The definition

When it comes to print media, it is true that a CSS pixel is most likely truly 1/96 of an inch. A CSS `inch` would thus be 96 pixels, and all the other absolute CSS length units would consequently be true to size as well.

When it comes to device screens, however, the [definition changes](https://www.w3.org/TR/css-values-4/#absolute-lengths).

First, we must understand the concept of the reference pixel. The reference pixel is defined as the "visual angle of one pixel on a device with a device pixel density of 96dpi and a distance from the reader of (28 inches)" ([https://www.w3.org/TR/css-values-4/#absolute-lengths](https://www.w3.org/TR/css-values-4/#absolute-lengths)). Doing the math (2.54/96) shows us that a reference pixel is about 0.265mm when the device is 28 inches away from the reader.

The "visual angle" part here is key. The definition is not saying that a reference pixel has a fixed length of 0.265mm. But rather, it is saying that a reference pixel should look visually the same size as the pixel described in the definition, regardless of what distance the device is viewed at.

For example, if you have a device that is typically viewed from a distance of 84 inches rather than 28 inches, then the reference pixel for this device would have to be 3 times bigger than the pixel described in the definition (0.265mm*3=0.795mm) in order for the two pixels to visually look the same size.

Similarly, if you have a device that is typically viewed closer than 28 inches (like a mobile device), the reference pixel would thus have to be smaller.

The size of a CSS pixel for a given device is then defined as the number of actual physical device pixels that best approximate the size of the reference of a pixel, otherwise known as the **device pixel ratio** (DPR). This ensures a consistent viewing experience regardless of device distance.

For a super high resolution mobile device, this may mean that a 3x3 grid of device pixels may need to map to 1 CSS pixel. For a low resolution monitor, maybe 1 device pixel is satisfactory. The device manufacturer determines the DPR of a device (and by extension, its intended viewing distance).

Further, every other CSS absolute unit is based on the length of this CSS pixel, which also explains why a CSS inch often isn't the same length as a physical inch.

The bottom line is that the size of a CSS pixel varies based on the device and the intended viewing distance of the device. This explains why the simulated iPhone SE appeared so large to me on my computer monitor, as the physical size of a CSS pixel is simply bigger on my monitor than it is in the typical mobile device.