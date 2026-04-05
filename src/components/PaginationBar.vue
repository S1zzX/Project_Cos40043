<script setup>
const props = defineProps({
  currentPage: { type: Number, required: true },
  totalPages: { type: Number, required: true }
})
const emit = defineEmits(['page-change'])

function goToPage(page) {
  if (page >= 1 && page <= props.totalPages) {
    emit('page-change', page)
  }
}

function pages() {
  const range = []
  const delta = 2
  for (let i = Math.max(1, props.currentPage - delta); i <= Math.min(props.totalPages, props.currentPage + delta); i++) {
    range.push(i)
  }
  return range
}
</script>

<template>
  <nav v-if="totalPages > 1" aria-label="Pagination">
    <ul class="pagination justify-content-center flex-wrap gap-1">
      <li class="page-item" :class="{ disabled: currentPage === 1 }">
        <button class="page-link" @click="goToPage(currentPage - 1)">
          <i class="bi bi-chevron-left"></i>
        </button>
      </li>

      <li v-if="pages()[0] > 1" class="page-item">
        <button class="page-link" @click="goToPage(1)">1</button>
      </li>
      <li v-if="pages()[0] > 2" class="page-item disabled">
        <span class="page-link">…</span>
      </li>

      <li v-for="page in pages()" :key="page" class="page-item" :class="{ active: page === currentPage }">
        <button class="page-link" @click="goToPage(page)">{{ page }}</button>
      </li>

      <li v-if="pages()[pages().length - 1] < totalPages - 1" class="page-item disabled">
        <span class="page-link">…</span>
      </li>
      <li v-if="pages()[pages().length - 1] < totalPages" class="page-item">
        <button class="page-link" @click="goToPage(totalPages)">{{ totalPages }}</button>
      </li>

      <li class="page-item" :class="{ disabled: currentPage === totalPages }">
        <button class="page-link" @click="goToPage(currentPage + 1)">
          <i class="bi bi-chevron-right"></i>
        </button>
      </li>
    </ul>
  </nav>
</template>
