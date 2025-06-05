import AlgoliaService from "@/lib/algolia"

async function setupAlgolia() {
  try {
    console.log("🔧 Setting up Algolia indices...")

    // Configure main index
    await AlgoliaService.configureIndex()
    console.log("✅ Main index configured")

    // Create replica indices for sorting
    await AlgoliaService.createReplicas()
    console.log("✅ Replica indices created")

    console.log("🎉 Algolia setup completed successfully!")
  } catch (error) {
    console.error("❌ Algolia setup failed:", error)
    process.exit(1)
  }
}

// Run setup if this file is executed directly
if (require.main === module) {
  setupAlgolia()
}

export default setupAlgolia
