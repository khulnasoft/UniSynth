<script>
export default {
  name: 'ErrorBoundary',
  data: () => ({
    error: false,
  }),
  errorCaptured(err, vm, info) {
    console.error('Error in Khulnasoft.com block:', error);
    this.error = true;
  },
  render(h) {
    return this.error
      ? h('p', 'Khulnasoft.com render error')
      : this.$slots.default[0];
  },
};
</script>
