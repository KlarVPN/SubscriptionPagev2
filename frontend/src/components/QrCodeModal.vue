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
        class="fixed inset-0 z-[200] grid place-items-center bg-[rgba(5,8,14,0.72)] p-4 backdrop-blur-[14px]"
        role="dialog"
        aria-modal="true"
        :aria-label="props.title"
        @click.self="open = false"
      >
        <div
          class="w-full max-w-[420px] rounded-[24px] border border-white/10 bg-[rgba(17,22,31,0.96)] p-4 shadow-[0_30px_80px_rgba(0,0,0,0.4)]"
        >
          <div class="mb-4 flex items-start justify-between gap-4">
            <div>
              <div class="text-base font-bold">
                {{ props.title }}
              </div>
              <div class="mt-1 text-sm text-white/70">
                {{ props.description }}
              </div>
            </div>

            <button
              class="rounded-md p-1 text-white/80 transition hover:bg-white/5 hover:text-white"
              type="button"
              @click="open = false"
            >
              <X class="h-4 w-4" />
            </button>
          </div>

          <div v-if="props.imageSrc" class="mb-4 grid place-items-center p-2">
            <img
              :alt="props.imageAlt"
              :src="props.imageSrc"
              class="w-full max-w-[280px] rounded-[18px] bg-white p-2"
            />
          </div>

          <button
            class="mt-1.5 flex w-full items-center justify-center gap-2 rounded-[14px] border border-cyan-400/20 bg-gradient-to-br from-cyan-400/15 to-violet-500/10 px-4 py-[0.8rem] font-bold text-white transition hover:-translate-y-0.5 hover:border-cyan-400/30 hover:bg-white/10"
            type="button"
            @click="emit('copy')"
          >
            <Copy class="h-4 w-4 shrink-0" />
            <span>{{ props.copyLabel }}</span>
          </button>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
