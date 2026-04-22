<script setup lang="ts">
import { ref, useTemplateRef, onMounted, computed, watch, nextTick, onUnmounted } from 'vue';

interface GlassSurfaceProps {
  width?: string | number;
  height?: string | number;
  borderRadius?: number;
  blur?: boolean;
  scaleDeg?: number;
}

const props = withDefaults(defineProps<GlassSurfaceProps>(), {
  width: '100%',
  height: '100%',
  borderRadius: 20,
  blur: true,
  scaleDeg: 60
});

const isDarkMode = ref(false);

const updateDarkMode = () => {
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  isDarkMode.value = mediaQuery.matches;
  const handler = (e: MediaQueryListEvent) => {
    isDarkMode.value = e.matches;
  };
  mediaQuery.addEventListener('change', handler);
  return () => mediaQuery.removeEventListener('change', handler);
};

const generateUniqueId = () => Math.random().toString(36).substring(2, 15);
const uniqueId = generateUniqueId();
const filterId = `glass-filter-${uniqueId}`;
const redGradId = `red-grad-${uniqueId}`;
const blueGradId = `blue-grad-${uniqueId}`;

const containerRef = useTemplateRef<HTMLDivElement>('containerRef');
const feImageRef = useTemplateRef<SVGSVGElement>('feImageRef');

let resizeObserver: ResizeObserver | null = null;

const generateDisplacementMap = () => {
  const rect = containerRef.value?.getBoundingClientRect();
  const actualWidth = rect?.width || 400;
  const actualHeight = rect?.height || 200;

  const svgContent = `
    <svg viewBox="0 0 ${actualWidth} ${actualHeight}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="${redGradId}" x1="100%" y1="0%" x2="0%" y2="0%">
          <stop offset="0%" stop-color="#0000"/>
          <stop offset="100%" stop-color="red"/>
        </linearGradient>
        <linearGradient id="${blueGradId}" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#0000"/>
          <stop offset="100%" stop-color="blue"/>
        </linearGradient>
      </defs>
      <rect x="0" y="0" width="${actualWidth}" height="${actualHeight}" fill="black"></rect>
      <rect x="0" y="0" width="${actualWidth}" height="${actualHeight}" rx="${props.borderRadius}" fill="url(#${redGradId})" />
      <rect x="0" y="0" width="${actualWidth}" height="${actualHeight}" rx="${props.borderRadius}" fill="url(#${blueGradId})" style="mix-blend-mode: difference" />
      <rect x="10" y="10" width="${actualWidth - 20}" height="${actualHeight - 20}" rx="${props.borderRadius}" fill="hsl(0 0% 70% / 0.93)" style="filter:blur(11px)" />
    </svg>
  `;
  return `data:image/svg+xml,${encodeURIComponent(svgContent)}`;
};

const updateDisplacementMap = () => {
  if (feImageRef.value) {
    feImageRef.value.setAttribute('href', generateDisplacementMap());
  }
};

const supportsSVGFilters = () => {
  if (typeof window === 'undefined' || typeof navigator === 'undefined') return false;
  const isWebkit = /Safari/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent);
  const isFirefox = /Firefox/.test(navigator.userAgent);
  if (isWebkit || isFirefox) return false;
  const div = document.createElement('div');
  div.style.backdropFilter = `url(#${filterId})`;
  return div.style.backdropFilter !== '';
};

const containerStyles = computed(() => {
  const baseStyles = {
    width: typeof props.width === 'number' ? `${props.width}` : props.width,
    height: typeof props.height === 'number' ? `${props.height}` : props.height,
    borderRadius: `${props.borderRadius}px`,
    position: 'absolute' as const,
    zIndex: '1',
    top: 0,
    left: 0,
    isolation: 'isolate' as const,
    overflow: 'hidden',
    pointerEvent: 'none',
  };

  const svgSupported = supportsSVGFilters();

  if (svgSupported) {
    if (props.blur)
      return {
        ...baseStyles,
        background: `var(--sub-background-tr)`,
        border: `solid 1px var(--ex-background)`,
        backdropFilter: `url(#${filterId}) saturate(1) blur(2px)`,
      };
    else {
      return {
        ...baseStyles,
        border: `solid 1px var(--ex-background)`,
        backdropFilter: `url(#${filterId}) saturate(1) blur(0px)`,
      };
    }
  }

  return {
    ...baseStyles,
    background: isDarkMode.value ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.25)',
    backdropFilter: 'blur(12px)',
    WebkitBackdropFilter: 'blur(12px)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
  };
});

const setupResizeObserver = () => {
  if (!containerRef.value || typeof ResizeObserver === 'undefined') return;
  resizeObserver = new ResizeObserver(() => {
    setTimeout(updateDisplacementMap, 0);
  });
  resizeObserver.observe(containerRef.value);
};

watch([() => props.width, () => props.height, () => props.borderRadius], () => {
  updateDisplacementMap();
});

onMounted(() => {
  const cleanup = updateDarkMode();
  nextTick(() => {
    updateDisplacementMap();
    setupResizeObserver();
  });
  onUnmounted(() => {
    if (cleanup) cleanup();
    if (resizeObserver) resizeObserver.disconnect();
  });
});
</script>

<template>
  <div ref="containerRef" class="relative flex items-center justify-center overflow-hidden" :style="containerStyles">
    <div v-if="supportsSVGFilters()" class="absolute inset-0 -z-10 opacity-0 pointer-events-none" :style="{width: '100%', height: '100%'}">
      <svg class="w-full h-full" xmlns="http://www.w3.org/2000/svg" :style="{width: '100%', height: '100%'}">
        <defs>
          <filter :id="filterId" color-interpolation-filters="sRGB" x="0%" y="0%" width="100%" height="100%">
            <feImage ref="feImageRef" x="0" y="0" width="100%" height="100%" preserveAspectRatio="none" result="map" />
            <feDisplacementMap in="SourceGraphic" in2="map" xChannelSelector="R" yChannelSelector="G" :scale="props.scaleDeg" result="displaced" />
            <feColorMatrix in="displaced" type="matrix" values="1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 1 0" result="output" />
            <feGaussianBlur in="output" stdDeviation="1" />
          </filter>
        </defs>
      </svg>
    </div>
    <div class="w-full h-full flex items-center justify-center rounded-[inherit] relative z-10">
      <slot />
    </div>
  </div>
</template>
