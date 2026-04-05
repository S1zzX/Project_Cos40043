<script setup>
defineProps({ review: { type: Object, required: true } })
function stars(r) { return '★'.repeat(Math.round(r)) + '☆'.repeat(5 - Math.round(r)) }
</script>

<template>
  <div class="review-card p-3">
    <div class="d-flex align-items-center gap-2 mb-2">
      <div class="avatar-circle" style="width:38px;height:38px;font-size:0.85rem;border-radius:50%;">
        {{ review.userName?.[0]?.toUpperCase() || 'U' }}
      </div>
      <div>
        <div class="fw-semibold" style="font-size:0.9rem;color:var(--text-primary)">{{ review.userName }}</div>
        <div class="small" style="color:var(--text-muted)">{{ review.date }}</div>
      </div>
      <div class="ms-auto stars" style="font-size:0.85rem">{{ stars(review.rating) }}</div>
    </div>
    <p class="mb-0 small" style="color:var(--text-secondary);line-height:1.6">{{ review.comment }}</p>
  </div>
</template>

<style scoped>
.review-card {
  border: 1px solid var(--border);
  border-radius: 10px;
  background: var(--bg-surface-2);
}
</style>
