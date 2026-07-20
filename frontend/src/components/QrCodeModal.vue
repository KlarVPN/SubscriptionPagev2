<script setup lang="ts">
import { Copy, X } from 'lucide-vue-next'

const open = defineModel<boolean>('open', { required: true })

const props = defineProps<{
  copyLabel: string
  description: string
  imageAlt: string
  imageSrc: string
  title: string
}>()

const emit = defineEmits<{
  copy: []
}>()
</script>

<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition-opacity duration-150"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-opacity duration-150"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="open"
        class="fixed inset-0 z-[200] grid place-items-center bg-black/10 p-4 backdrop-blur-[14px]"
        role="dialog"
        aria-modal="true"
        :aria-label="props.title"
        @click.self="open = false"
      >
        <div
          class="w-fit rounded-[24px] bg-neutral-950 p-4"
        >
          <div v-if="props.imageSrc" class="grid place-items-center p-2 w-fit">
            <img
              :alt="props.imageAlt"
              :src="props.imageSrc"
              class="w-full size-[280px] rounded-[18px] bg-white p-2"
            />
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
