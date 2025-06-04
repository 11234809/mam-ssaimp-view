export function errorMessage(error) {
    this.$message({ message: error, type: "error" });
}