import algoliasearch from "algoliasearch"

// Initialize Algolia client
const client = algoliasearch(process.env.NEXT_PUBLIC_ALGOLIA_APP_ID!, process.env.ALGOLIA_ADMIN_API_KEY!)

// Initialize search client for frontend
export const searchClient = algoliasearch(
  process.env.NEXT_PUBLIC_ALGOLIA_APP_ID!,
  process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_API_KEY!,
)

// Index names
export const INDICES = {
  PROPERTIES: "properties",
  USERS: "users",
  LOCATIONS: "locations",
} as const

// Get indices
export const propertiesIndex = client.initIndex(INDICES.PROPERTIES)
export const usersIndex = client.initIndex(INDICES.USERS)
export const locationsIndex = client.initIndex(INDICES.LOCATIONS)

// Search indices for frontend
export const searchPropertiesIndex = searchClient.initIndex(INDICES.PROPERTIES)

export interface PropertySearchRecord {
  objectID: string
  title: string
  description: string
  price: number
  location: string
  city: string
  state: string
  category: "buy" | "rent" | "shortlet"
  property_type: string
  bedrooms?: number
  bathrooms?: number
  max_guests?: number
  amenities: string[]
  images: string[]
  owner_name: string
  owner_verified: boolean
  featured: boolean
  verified: boolean
  rating: number
  views: number
  created_at: string
  coordinates?: {
    lat: number
    lng: number
  }
}

export interface SearchFilters {
  category?: string
  location?: string
  priceMin?: number
  priceMax?: number
  bedrooms?: number
  bathrooms?: number
  property_type?: string
  amenities?: string[]
  verified?: boolean
  featured?: boolean
}

export class AlgoliaService {
  // Index a single property
  static async indexProperty(property: PropertySearchRecord) {
    try {
      await propertiesIndex.saveObject(property)
      console.log(`Property ${property.objectID} indexed successfully`)
    } catch (error) {
      console.error("Error indexing property:", error)
      throw error
    }
  }

  // Index multiple properties
  static async indexProperties(properties: PropertySearchRecord[]) {
    try {
      await propertiesIndex.saveObjects(properties)
      console.log(`${properties.length} properties indexed successfully`)
    } catch (error) {
      console.error("Error indexing properties:", error)
      throw error
    }
  }

  // Delete property from index
  static async deleteProperty(propertyId: string) {
    try {
      await propertiesIndex.deleteObject(propertyId)
      console.log(`Property ${propertyId} deleted from index`)
    } catch (error) {
      console.error("Error deleting property from index:", error)
      throw error
    }
  }

  // Search properties with filters
  static async searchProperties(
    query = "",
    filters: SearchFilters = {},
    options: {
      page?: number
      hitsPerPage?: number
      sortBy?: string
    } = {},
  ) {
    try {
      const { page = 0, hitsPerPage = 20, sortBy } = options

      // Build filter string
      const filterParts: string[] = []

      if (filters.category) {
        filterParts.push(`category:${filters.category}`)
      }

      if (filters.priceMin !== undefined) {
        filterParts.push(`price >= ${filters.priceMin}`)
      }

      if (filters.priceMax !== undefined) {
        filterParts.push(`price <= ${filters.priceMax}`)
      }

      if (filters.bedrooms !== undefined) {
        filterParts.push(`bedrooms >= ${filters.bedrooms}`)
      }

      if (filters.bathrooms !== undefined) {
        filterParts.push(`bathrooms >= ${filters.bathrooms}`)
      }

      if (filters.property_type) {
        filterParts.push(`property_type:${filters.property_type}`)
      }

      if (filters.verified !== undefined) {
        filterParts.push(`verified:${filters.verified}`)
      }

      if (filters.featured !== undefined) {
        filterParts.push(`featured:${filters.featured}`)
      }

      if (filters.amenities && filters.amenities.length > 0) {
        const amenityFilters = filters.amenities.map((amenity) => `amenities:${amenity}`).join(" AND ")
        filterParts.push(`(${amenityFilters})`)
      }

      const filterString = filterParts.join(" AND ")

      // Search parameters
      const searchParams: any = {
        query,
        page,
        hitsPerPage,
        filters: filterString,
        attributesToRetrieve: [
          "objectID",
          "title",
          "description",
          "price",
          "location",
          "city",
          "state",
          "category",
          "property_type",
          "bedrooms",
          "bathrooms",
          "max_guests",
          "amenities",
          "images",
          "owner_name",
          "owner_verified",
          "featured",
          "verified",
          "rating",
          "views",
          "created_at",
          "coordinates",
        ],
        attributesToHighlight: ["title", "description", "location"],
        highlightPreTag: "<mark>",
        highlightPostTag: "</mark>",
      }

      // Add location-based search if location filter is provided
      if (filters.location) {
        searchParams.aroundLatLngViaIP = false
        searchParams.filters = filterString + (filterString ? " AND " : "") + `location:"${filters.location}"`
      }

      // Handle sorting
      let index = searchPropertiesIndex
      if (sortBy) {
        switch (sortBy) {
          case "price_asc":
            index = searchClient.initIndex(`${INDICES.PROPERTIES}_price_asc`)
            break
          case "price_desc":
            index = searchClient.initIndex(`${INDICES.PROPERTIES}_price_desc`)
            break
          case "rating":
            index = searchClient.initIndex(`${INDICES.PROPERTIES}_rating_desc`)
            break
          case "newest":
            index = searchClient.initIndex(`${INDICES.PROPERTIES}_created_at_desc`)
            break
        }
      }

      const result = await index.search(query, searchParams)

      return {
        hits: result.hits as PropertySearchRecord[],
        nbHits: result.nbHits,
        page: result.page,
        nbPages: result.nbPages,
        hitsPerPage: result.hitsPerPage,
        processingTimeMS: result.processingTimeMS,
        query: result.query,
        params: result.params,
      }
    } catch (error) {
      console.error("Error searching properties:", error)
      throw error
    }
  }

  // Get search suggestions/autocomplete
  static async getSearchSuggestions(query: string, maxSuggestions = 5) {
    try {
      const result = await searchPropertiesIndex.search(query, {
        hitsPerPage: maxSuggestions,
        attributesToRetrieve: ["title", "location", "city", "category"],
        attributesToHighlight: ["title", "location"],
      })

      return result.hits.map((hit: any) => ({
        objectID: hit.objectID,
        title: hit.title,
        location: hit.location,
        city: hit.city,
        category: hit.category,
        _highlightResult: hit._highlightResult,
      }))
    } catch (error) {
      console.error("Error getting search suggestions:", error)
      throw error
    }
  }

  // Get popular searches
  static async getPopularSearches() {
    try {
      // This would typically come from analytics data
      // For now, return some predefined popular searches
      return [
        "Apartments in Lagos",
        "Houses for sale in Abuja",
        "Shortlet in Victoria Island",
        "Luxury homes in Ikoyi",
        "Affordable housing in Yaba",
        "Penthouses in Lekki",
        "Commercial properties",
        "Land for sale",
      ]
    } catch (error) {
      console.error("Error getting popular searches:", error)
      return []
    }
  }

  // Configure index settings
  static async configureIndex() {
    try {
      await propertiesIndex.setSettings({
        // Searchable attributes
        searchableAttributes: [
          "title",
          "description",
          "location",
          "city",
          "state",
          "amenities",
          "property_type",
          "owner_name",
        ],

        // Attributes for faceting
        attributesForFaceting: [
          "category",
          "property_type",
          "city",
          "state",
          "bedrooms",
          "bathrooms",
          "amenities",
          "verified",
          "featured",
          "owner_verified",
        ],

        // Custom ranking
        customRanking: ["desc(featured)", "desc(verified)", "desc(rating)", "desc(views)", "desc(created_at)"],

        // Ranking
        ranking: ["typo", "geo", "words", "filters", "proximity", "attribute", "exact", "custom"],

        // Highlighting
        highlightPreTag: '<mark class="bg-yellow-200">',
        highlightPostTag: "</mark>",

        // Pagination
        hitsPerPage: 20,
        maxValuesPerFacet: 100,

        // Typo tolerance
        minWordSizefor1Typo: 4,
        minWordSizefor2Typos: 8,

        // Query rules
        enableRules: true,
      })

      console.log("Algolia index configured successfully")
    } catch (error) {
      console.error("Error configuring Algolia index:", error)
      throw error
    }
  }

  // Create replica indices for sorting
  static async createReplicas() {
    try {
      await propertiesIndex.setSettings({
        replicas: [
          `${INDICES.PROPERTIES}_price_asc`,
          `${INDICES.PROPERTIES}_price_desc`,
          `${INDICES.PROPERTIES}_rating_desc`,
          `${INDICES.PROPERTIES}_created_at_desc`,
        ],
      })

      // Configure replica indices
      const priceAscIndex = client.initIndex(`${INDICES.PROPERTIES}_price_asc`)
      await priceAscIndex.setSettings({
        ranking: ["asc(price)", "typo", "geo", "words", "filters", "proximity", "attribute", "exact", "custom"],
      })

      const priceDescIndex = client.initIndex(`${INDICES.PROPERTIES}_price_desc`)
      await priceDescIndex.setSettings({
        ranking: ["desc(price)", "typo", "geo", "words", "filters", "proximity", "attribute", "exact", "custom"],
      })

      const ratingDescIndex = client.initIndex(`${INDICES.PROPERTIES}_rating_desc`)
      await ratingDescIndex.setSettings({
        ranking: ["desc(rating)", "typo", "geo", "words", "filters", "proximity", "attribute", "exact", "custom"],
      })

      const newestIndex = client.initIndex(`${INDICES.PROPERTIES}_created_at_desc`)
      await newestIndex.setSettings({
        ranking: ["desc(created_at)", "typo", "geo", "words", "filters", "proximity", "attribute", "exact", "custom"],
      })

      console.log("Algolia replica indices created successfully")
    } catch (error) {
      console.error("Error creating replica indices:", error)
      throw error
    }
  }
}

export default AlgoliaService
