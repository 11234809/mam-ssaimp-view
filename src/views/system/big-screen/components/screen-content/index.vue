<template>
  <div class="screen-wrapper" ref="screenWrapper" :style="wrapperStyleReactive">
    <slot />
  </div>
</template>

<script setup>
import { ref, reactive, watch, onMounted, onBeforeUnmount, nextTick } from 'vue'

/** 防抖函数 */
function debounce(fn, delay = 100) {
  let timer = null
  return (...args) => {
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => {
      fn(...args)
    }, delay)
  }
}

const props = defineProps({
  width: { type: [String, Number], default: 1920 },
  height: { type: [String, Number], default: 1080 },
  fullScreen: { type: Boolean, default: false },
  autoScale: { type: [Object, Boolean], default: true },
  selfAdaption: { type: Boolean, default: true },
  delay: { type: Number, default: 500 },
  boxStyle: { type: Object, default: () => ({}) },
  wrapperStyle: { type: Object, default: () => ({}) }
})

// refs & reactive state
const screenWrapper = ref(null)

const state = reactive({
  currentWidth: 0,
  currentHeight: 0,
  originalWidth: 0,
  originalHeight: 0,
  computedScale: 1,
  preWscale: 1,
  preHscale: 1
})

const wrapperStyleReactive = ref({ ...props.wrapperStyle })

// 监听 props.wrapperStyle 变化，动态合并样式
watch(() => props.wrapperStyle, (newStyle) => {
  wrapperStyleReactive.value = { ...newStyle }
}, { deep: true })

// watch 宽高变化，重新更新样式和缩放
watch([() => props.width, () => props.height], () => {
  clearStyle()
  clearListener()
  nextTick(() => {
    resize()
    addListener()
  })
})

// 初始化尺寸
function initSize() {
  return new Promise((resolve) => {
    if (!screenWrapper.value) return resolve()
    screenWrapper.value.parentNode.scrollLeft = 0
    screenWrapper.value.parentNode.scrollTop = 0

    nextTick(() => {
      if (props.width && props.height) {
        state.currentWidth = Number(props.width)
        state.currentHeight = Number(props.height)
      } else if (screenWrapper.value) {
        state.currentWidth = screenWrapper.value.clientWidth
        state.currentHeight = screenWrapper.value.clientHeight
      }

      if (!state.originalWidth || !state.originalHeight) {
        state.originalWidth = window.screen.width
        state.originalHeight = window.screen.height
      }
      resolve()
    })
  })
}

// 更新尺寸样式
function updateSize() {
  if (!screenWrapper.value) return
  if (state.currentWidth && state.currentHeight) {
    screenWrapper.value.style.width = `${state.currentWidth}px`
    screenWrapper.value.style.height = `${state.currentHeight}px`
  } else {
    screenWrapper.value.style.width = `${state.originalWidth}px`
    screenWrapper.value.style.height = `${state.originalHeight}px`
  }
}

// 处理自动缩放
function handleAutoScale(widthScale, heightScale) {
  if (!props.autoScale) return
  if (!screenWrapper.value) return

  const domWidth = screenWrapper.value.clientWidth
  const domHeight = screenWrapper.value.clientHeight
  const currentWidth = window.innerWidth
  const currentHeight = window.innerHeight

  screenWrapper.value.style.transform = `scale(${widthScale},${heightScale})`

  let mx = Math.max((currentWidth - domWidth * widthScale) / 2, 0)
  let my = Math.max((currentHeight - domHeight * heightScale) / 2, 0)

  if (typeof props.autoScale === 'object') {
    if (!props.autoScale.x) mx = 0
    if (!props.autoScale.y) my = 0
  }

  screenWrapper.value.style.margin = `${my}px ${mx}px`
}

// 更新缩放比例
function updateScale() {
  if (!screenWrapper.value) return
  const currentWidth = window.innerWidth
  const currentHeight = window.innerHeight
  const realWidth = state.currentWidth || state.originalWidth
  const realHeight = state.currentHeight || state.originalHeight

  const widthScale = currentWidth / realWidth
  const heightScale = currentHeight / realHeight

  // 修复地图缩放偏移问题
  nextTick(() => {
    const map = document.querySelector('#theme-map')
    if (map) {
      map.style.transform = `scale(${1 / widthScale},${1 / heightScale})`
      const newWidth = (map.offsetWidth / state.preWscale) * widthScale
      const newHeight = (map.offsetHeight / state.preHscale) * heightScale
      map.style.transformOrigin = '0 0'
      map.style.width = `${newWidth}px`
      map.style.height = `${newHeight}px`
      state.preWscale = widthScale
      state.preHscale = heightScale
    }
  })

  state.computedScale = Math.min(widthScale, heightScale)

  if (props.fullScreen) {
    screenWrapper.value.style.transform = `scale(${widthScale},${heightScale})`
    return
  }

  handleAutoScale(widthScale, heightScale)
}

// 清理样式
function clearStyle() {
  if (!screenWrapper.value) return
  if (screenWrapper.value.parentNode) {
    screenWrapper.value.parentNode.style.overflow = 'hidden'
  }
  screenWrapper.value.style.cssText = ''
  wrapperStyleReactive.value = { ...props.wrapperStyle }
}

// 清理监听
function clearListener() {
  window.removeEventListener('resize', onResize)
}

// 添加监听
function addListener() {
  window.addEventListener('resize', onResize)
}

const onResize = debounce(() => {
  resize()
}, props.delay)

// 重新计算
async function resize() {
  if (!props.selfAdaption) return
  await initSize()
  updateSize()
  updateScale()
}

// 生命周期钩子
onMounted(() => {
  clearStyle()
  clearListener()
  if (props.selfAdaption) {
    resize()
    addListener()
  }
})

onBeforeUnmount(() => {
  clearStyle()
  clearListener()
})
</script>

<style scoped lang="scss">
.screen-wrapper {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 500ms;
  overflow: hidden;
  transform-origin: left top;
  position: relative;
  background: #1c3954;
  // overflow-y: auto;
}
</style>
