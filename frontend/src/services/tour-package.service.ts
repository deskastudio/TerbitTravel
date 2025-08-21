// services/tour-package.service.ts

import axios from "@/lib/axios";
import {
  ITourPackage,
  ITourPackageInput,
  IDestination,
  IHotel,
  IArmada,
  IConsumption,
  IPackageCategory,
} from "@/types/tour-package.types";

export class TourPackageService {
  // Tambahkan retry mechanism
  private static async callWithRetry<T>(
    apiCall: () => Promise<T>,
    maxRetries: number = 3,
    delayMs: number = 1000
  ): Promise<T> {
    let lastError: Error | unknown;
    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        return await apiCall();
      } catch (error) {
        console.error(
          `API call failed (attempt ${attempt + 1}/${maxRetries}):`,
          error
        );
        lastError = error;
        // Only delay if we're going to retry
        if (attempt < maxRetries - 1) {
          await new Promise((resolve) =>
            setTimeout(resolve, delayMs * (attempt + 1))
          );
        }
      }
    }
    throw lastError;
  }

  // ========================
  //     Paket Wisata
  // ========================
  static async getAllPackages(): Promise<ITourPackage[]> {
    try {
      return await this.callWithRetry(async () => {
        const response = await axios.get("/package");

        if (!Array.isArray(response.data)) {
          console.error("Data dari API bukan array:", response.data);
          return [];
        }

        // Setiap paket menggunakan foto dari destinasi
        return response.data.map((pkg) => ({
          ...pkg,
          // Foto paket = foto destinasi
          foto: pkg.destination?.foto || [],
          include: pkg.include || [],
          exclude: pkg.exclude || [],
          jadwal: pkg.jadwal || [],
        }));
      });
    } catch (error) {
      console.error("Error fetching packages:", error);
      return [];
    }
  }

  static async createPackage(data: ITourPackageInput): Promise<ITourPackage> {
    try {
      return await this.callWithRetry(async () => {
        const response = await axios.post("/package", {
          ...data,
          jadwal: data.jadwal.map((schedule) => ({
            ...schedule,
            tanggalAwal: new Date(schedule.tanggalAwal).toISOString(),
            tanggalAkhir: new Date(schedule.tanggalAkhir).toISOString(),
          })),
        });
        return response.data;
      });
    } catch (error) {
      console.error("Request payload:", data);
      console.error("Error response:", (error as { response?: { data: unknown } })?.response?.data);
      throw error;
    }
  }

  static async getPackageById(id: string): Promise<ITourPackage> {
    try {
      return await this.callWithRetry(async () => {
        const response = await axios.get(`/package/${id}`);

        const packageData = response.data;
        return {
          ...packageData,
          // Foto paket = foto destinasi
          foto: packageData.destination?.foto || [],
          include: packageData.include || [],
          exclude: packageData.exclude || [],
          jadwal: packageData.jadwal || [],
          destination: packageData.destination || {
            nama: "Unnamed Destination",
            lokasi: "Unknown Location",
          },
          hotel: packageData.hotel || { nama: "Default Hotel", bintang: 3 },
          armada: packageData.armada || {
            nama: "Default Transport",
            kapasitas: 15,
          },
          consume: packageData.consume || { nama: "Default Consumption" },
          kategori: packageData.kategori || {
            _id: "default",
            title: "Default Category",
          },
        };
      });
    } catch (error) {
      console.error(`Error fetching package with id ${id}:`, error);
      throw error;
    }
  }

  static async updatePackage(
    id: string,
    data: Partial<ITourPackageInput>
  ): Promise<ITourPackage> {
    try {
      return await this.callWithRetry(async () => {
        const response = await axios.put(`/package/${id}`, data);
        return response.data;
      });
    } catch (error) {
      console.error(`Error updating package with id ${id}:`, error);
      throw error;
    }
  }

  static async deletePackage(id: string): Promise<void> {
    try {
      await this.callWithRetry(async () => {
        await axios.delete(`/package/${id}`);
      });
    } catch (error) {
      console.error(`Error deleting package with id ${id}:`, error);
      throw error;
    }
  }

  // ========================
  //  Kategori Paket Wisata
  // ========================
  static async getAllCategories(): Promise<IPackageCategory[]> {
    try {
      return await this.callWithRetry(async () => {
        const response = await axios.get("/package-category/getAll");
        return response.data;
      });
    } catch (error) {
      console.error("Error fetching categories:", error);
      return [];
    }
  }

  static async createCategory(
    title: string
  ): Promise<{ message: string; data: IPackageCategory }> {
    try {
      return await this.callWithRetry(async () => {
        const response = await axios.post("/package-category/add", { title });
        return response.data;
      });
    } catch (error) {
      console.error("Error creating category:", error);
      throw error;
    }
  }

  static async updateCategory(
    id: string,
    title: string
  ): Promise<{ message: string; data: IPackageCategory }> {
    try {
      return await this.callWithRetry(async () => {
        const response = await axios.put(`/package-category/update/${id}`, {
          title,
        });
        return response.data;
      });
    } catch (error) {
      console.error(`Error updating category with id ${id}:`, error);
      throw error;
    }
  }

  static async deleteCategory(id: string): Promise<{ message: string }> {
    try {
      return await this.callWithRetry(async () => {
        const response = await axios.delete(`/package-category/delete/${id}`);
        return response.data;
      });
    } catch (error) {
      console.error(`Error deleting category with id ${id}:`, error);
      throw error;
    }
  }

  // =======================================
  //  Destinasi, Hotel, Armada, Konsumsi
  // =======================================
  static async getDestinations(): Promise<IDestination[]> {
    try {
      return await this.callWithRetry(async () => {
        const response = await axios.get("/destination/getAll");
        return response.data;
      });
    } catch (error) {
      console.error("Error fetching destinations:", error);
      return [];
    }
  }

  static async getHotels(): Promise<IHotel[]> {
    try {
      return await this.callWithRetry(async () => {
        const response = await axios.get("/hotel/getAll");
        return response.data;
      });
    } catch (error) {
      console.error("Error fetching hotels:", error);
      return [];
    }
  }

  static async getArmada(): Promise<IArmada[]> {
    try {
      return await this.callWithRetry(async () => {
        const response = await axios.get("/armada/getAll");
        return response.data;
      });
    } catch (error) {
      console.error("Error fetching armada:", error);
      return [];
    }
  }

  static async getConsumptions(): Promise<IConsumption[]> {
    try {
      return await this.callWithRetry(async () => {
        const response = await axios.get("/consume/getAll");
        return response.data;
      });
    } catch (error) {
      console.error("Error fetching consumptions:", error);
      return [];
    }
  }

  // Get packages by category
  static async getPackagesByCategory(
    categoryId: string,
    limit: number = 10,
    excludeId?: string
  ): Promise<ITourPackage[]> {
    try {
      return await this.callWithRetry(async () => {
        const params = new URLSearchParams();
        params.append("limit", limit.toString());
        if (excludeId) {
          params.append("excludeId", excludeId);
        }

        const response = await axios.get(
          `/package/category/${categoryId}?${params.toString()}`
        );

        // Handle if data is not valid
        if (!Array.isArray(response.data)) {
          console.error("Data from API is not an array:", response.data);
          return [];
        }

        // Ensure all objects have required properties
        return response.data.map((pkg) => ({
          ...pkg,
          // Foto paket = foto destinasi
          foto: pkg.destination?.foto || [],
          include: pkg.include || [],
          exclude: pkg.exclude || [],
          jadwal: pkg.jadwal || [],
        }));
      });
    } catch (error) {
      console.error(
        `Error fetching packages for category ${categoryId}:`,
        error
      );
      // Return empty array instead of throwing
      return [];
    }
  }

  /**
   * Helper method to compare MongoDB ObjectIds which can be in different formats
   * Enhanced to better handle MongoDB ObjectId variations
   */
  private static compareObjectIds(id1?: string, id2?: string): boolean {
    if (!id1 || !id2) return false;
    
    console.log(`🔍 Comparing IDs: "${id1}" vs "${id2}"`);
    
    // Standardize the IDs by removing any non-hex characters
    // MongoDB ObjectIds are 24-character hex strings
    const cleanId1 = id1.replace(/[^a-fA-F0-9]/g, '');
    const cleanId2 = id2.replace(/[^a-fA-F0-9]/g, '');
    
    // If either ID doesn't look like a valid ObjectId after cleaning (not 24 hex chars)
    // fall back to the original string comparison
    const isValidObjectId1 = cleanId1.length === 24;
    const isValidObjectId2 = cleanId2.length === 24;
    
    console.log(`Clean ID1: ${cleanId1} (${isValidObjectId1 ? 'valid' : 'invalid'} ObjectId)`);
    console.log(`Clean ID2: ${cleanId2} (${isValidObjectId2 ? 'valid' : 'invalid'} ObjectId)`);
    
    // Exact match on cleaned IDs
    if (cleanId1 === cleanId2) {
      console.log("✅ Exact match found after cleaning");
      return true;
    }
    
    // If both are valid ObjectIds but don't match exactly, they're definitely different
    if (isValidObjectId1 && isValidObjectId2) {
      console.log("❌ Both are valid ObjectIds but don't match");
      return false;
    }
    
    // Check for substring match (sometimes ObjectId representations can vary in format)
    // Only do this if at least one ID isn't a valid ObjectId format
    if (cleanId1.includes(cleanId2) || cleanId2.includes(cleanId1)) {
      console.log("✅ Substring match found");
      return true;
    }
    
    // Calculate similarity for debugging
    let matchingChars = 0;
    const minLength = Math.min(cleanId1.length, cleanId2.length);
    for (let i = 0; i < minLength; i++) {
      if (cleanId1[i] === cleanId2[i]) matchingChars++;
    }
    
    const similarity = matchingChars / minLength;
    console.log(`📊 ID Similarity: ${(similarity * 100).toFixed(1)}% (${matchingChars}/${minLength} chars match)`);
    
    return false;
  }

  /**
   * Get packages by destination ID
   * This function gets all packages and filters them by destination ID
   */
  static async getPackagesByDestination(destinationId: string): Promise<ITourPackage[]> {
    try {
      console.log(`🔍 Fetching packages for destination ID: ${destinationId}`);
      
      if (!destinationId) {
        console.error("❌ No destination ID provided");
        return [];
      }
      
      // Debug: Add alert to confirm filtering is being attempted
      console.log("%c🔎 DEBUG: Filtering packages by destination", "background: #f7df1e; color: #000; padding: 2px 5px; border-radius: 3px; font-weight: bold;");
      
      return await this.callWithRetry(async () => {
        // Get all packages
        const allPackages = await this.getAllPackages();
        console.log(`📦 Got ${allPackages.length} total packages`);
        
        // Filter packages by destination ID
        const filteredPackages = allPackages.filter((pkg) => {
          // Check if destination exists and has an ID
          if (!pkg.destination || !pkg.destination._id) {
            console.log(`❌ Package ${pkg._id}: Missing destination data`);
            return false;
          }
          
          // Get the destination ID string
          const pkgDestId = pkg.destination._id.toString();
          
          // Compare both IDs
          console.log(`🔄 Comparing: Package destination ID ${pkgDestId} vs Filter ID ${destinationId}`);
          
          // Use our helper function to compare ObjectIds
          const isMatch = this.compareObjectIds(pkgDestId, destinationId);
          console.log(`   Result: ${isMatch ? '✅ Match' : '❌ No match'}`);
          
          return isMatch;
        });
        
        console.log(`✅ Found ${filteredPackages.length} packages for destination ${destinationId}`);
        
        if (filteredPackages.length > 0) {
          console.log('First package:', JSON.stringify({
            id: filteredPackages[0]._id,
            name: filteredPackages[0].nama,
            destination: filteredPackages[0].destination?.nama,
            destinationId: filteredPackages[0].destination?._id
          }));
        } else {
          // If no packages were found, log sample destination IDs to help debug
          console.log('Sample destination IDs from available packages:');
          const samplePackages = allPackages.filter(pkg => pkg.destination?._id).slice(0, 5);
          samplePackages.forEach((pkg, i) => {
            const destId = pkg.destination?._id?.toString();
            console.log(`Package ${i+1} destination ID: ${destId}`);
            console.log(`  Matches input ID: ${this.compareObjectIds(destId, destinationId)}`);
          });
        }
        
        return filteredPackages;
      });
    } catch (error) {
      console.error(
        `❌ Error fetching packages for destination ${destinationId}:`,
        error
      );
      // Return empty array instead of throwing
      return [];
    }
  }

  /**
   * Debug method to fix destination ID issues
   * This method logs detailed information about package destinations and attempts to find a match
   */
  static async findPackagesByDestinationFuzzy(destinationId: string): Promise<ITourPackage[]> {
    try {
      console.log(`🔎 Advanced debugging: Looking for packages with destination ID similar to ${destinationId}`);
      
      // Get all packages
      const allPackages = await this.getAllPackages();
      console.log(`📦 Total packages available: ${allPackages.length}`);
      
      if (allPackages.length === 0) {
        console.log("❌ No packages found in the database");
        return [];
      }
      
      // Count packages with destination data
      const packagesWithDestination = allPackages.filter(pkg => pkg.destination && pkg.destination._id);
      console.log(`📊 Packages with destination data: ${packagesWithDestination.length}/${allPackages.length}`);
      
      // Get unique destination IDs
      const uniqueDestinationIds = new Set();
      packagesWithDestination.forEach(pkg => {
        if (pkg.destination?._id) {
          uniqueDestinationIds.add(pkg.destination._id.toString());
        }
      });
      console.log(`🧩 Unique destination IDs found: ${uniqueDestinationIds.size}`);
      
      // List all unique destination IDs for reference
      console.log("📋 All unique destination IDs:");
      Array.from(uniqueDestinationIds).forEach((id, index) => {
        console.log(`  ${index+1}. ${id}`);
      });
      
      // Check similarity with each destination ID
      console.log(`\n🔍 Checking similarity with input ID: ${destinationId}`);
      const similarityMap = new Map();
      
      Array.from(uniqueDestinationIds).forEach(id => {
        const strId = String(id);
        
        // Count matching characters
        const minLength = Math.min(strId.length, destinationId.length);
        let matchingChars = 0;
        for (let i = 0; i < minLength; i++) {
          if (strId[i] === destinationId[i]) matchingChars++;
        }
        
        const similarity = matchingChars / minLength;
        similarityMap.set(strId, {
          similarity: similarity,
          matchingChars: matchingChars,
          totalChars: minLength
        });
      });
      
      // Sort by similarity
      const sortedResults = Array.from(similarityMap.entries())
        .sort((a, b) => b[1].similarity - a[1].similarity)
        .slice(0, 5);
      
      console.log("🏆 Top 5 most similar destination IDs:");
      sortedResults.forEach((entry, index) => {
        const [id, data] = entry;
        console.log(`  ${index+1}. ${id} - ${(data.similarity * 100).toFixed(1)}% match (${data.matchingChars}/${data.totalChars})`);
      });
      
      // Try to find packages with the most similar destination ID
      if (sortedResults.length > 0) {
        const bestMatchId = sortedResults[0][0];
        const bestMatchSimilarity = sortedResults[0][1].similarity;
        
        if (bestMatchSimilarity > 0.9) {
          console.log(`✅ Found highly similar destination ID: ${bestMatchId} (${(bestMatchSimilarity * 100).toFixed(1)}% match)`);
          console.log(`🔄 Trying to find packages with this destination ID instead...`);
          
          const matchedPackages = allPackages.filter(pkg => 
            pkg.destination && 
            pkg.destination._id && 
            pkg.destination._id.toString() === bestMatchId
          );
          
          console.log(`📦 Found ${matchedPackages.length} packages with the similar destination ID`);
          return matchedPackages;
        }
      }
      
      console.log("❌ No sufficiently similar destination ID found");
      return [];
      
    } catch (error) {
      console.error("❌ Error in fuzzy destination search:", error);
      return [];
    }
  }

  // =======================================
  //  Fungsi tambahan untuk gambar dan aset
  // =======================================
  static async getPackageImages(packageId: string): Promise<string[]> {
    try {
      return await this.callWithRetry(async () => {
        const response = await axios.get(`/package/${packageId}/images`);
        return response.data;
      });
    } catch (error) {
      console.error(`Error fetching images for package ${packageId}:`, error);
      // Return empty array if API fails
      return [];
    }
  }

  // Function to get user profile if they're logged in
  static async getUserProfile(): Promise<Record<string, unknown>> {
    try {
      return await this.callWithRetry(async () => {
        const response = await axios.get("/user/profile");
        return response.data;
      });
    } catch (error) {
      console.error("Error fetching user profile:", error);
      return {};
    }
  }

  // Function to save favorite packages
  static async saveFavoritePackage(
    packageId: string
  ): Promise<{ success: boolean; message: string }> {
    try {
      return await this.callWithRetry(async () => {
        const response = await axios.post("/user/favorites", { packageId });
        return response.data;
      });
    } catch (error) {
      console.error(`Error saving favorite package ${packageId}:`, error);
      return { success: false, message: "Failed to save favorite" };
    }
  }

  // Function to remove favorite packages
  static async removeFavoritePackage(
    packageId: string
  ): Promise<{ success: boolean; message: string }> {
    try {
      return await this.callWithRetry(async () => {
        const response = await axios.delete(`/user/favorites/${packageId}`);
        return response.data;
      });
    } catch (error) {
      console.error(`Error removing favorite package ${packageId}:`, error);
      return { success: false, message: "Failed to remove favorite" };
    }
  }

  /**
   * Debug method to get a single package for verification
   */
  static async debugGetSinglePackage(): Promise<ITourPackage | null> {
    try {
      const packages = await this.getAllPackages();
      if (packages.length === 0) {
        console.log("❌ No packages found in the database");
        return null;
      }
      
      const samplePackage = packages[0];
      console.log("📦 Sample package:", JSON.stringify({
        id: samplePackage._id,
        name: samplePackage.nama,
        destination: samplePackage.destination?.nama,
        destinationId: samplePackage.destination?._id
      }));
      
      return samplePackage;
    } catch (error) {
      console.error("❌ Error getting sample package:", error);
      return null;
    }
  }

  /**
   * Debug utility to check a specific destination ID against all packages
   * Logs detailed information about how destination IDs are being compared
   */
  static async debugDestinationIdMatching(destinationId: string): Promise<void> {
    try {
      console.log(`🔎 DEBUG: Checking destination ID: ${destinationId}`);
      
      const allPackages = await this.getAllPackages();
      console.log(`Total packages available: ${allPackages.length}`);
      
      if (allPackages.length === 0) {
        console.log("No packages found to compare");
        return;
      }
      
      console.log("\n📊 DESTINATION ID COMPARISON REPORT:");
      console.log("==========================================");
      console.log(`Comparing against: "${destinationId}"`);
      
      // Analyze the input destination ID
      const cleanDestId = destinationId.replace(/[^a-fA-F0-9]/g, '');
      console.log(`Clean input ID: ${cleanDestId} (${cleanDestId.length === 24 ? 'valid' : 'invalid'} ObjectId format)`);
      
      console.log("\n📦 PACKAGE DESTINATIONS:");
      console.log("==========================================");
      
      // Check each package
      allPackages.forEach((pkg, index) => {
        console.log(`\nPACKAGE #${index + 1} - "${pkg.nama}"`);
        
        // Check if this package has a destination
        if (!pkg.destination || !pkg.destination._id) {
          console.log(`❌ No destination data`);
          return;
        }
        
        const pkgDestId = String(pkg.destination._id);
        const cleanPkgDestId = pkgDestId.replace(/[^a-fA-F0-9]/g, '');
        
        console.log(`🔶 Original destination ID: "${pkgDestId}"`);
        console.log(`🔷 Cleaned destination ID: "${cleanPkgDestId}" (${cleanPkgDestId.length === 24 ? 'valid' : 'invalid'} ObjectId format)`);
        
        // Compare IDs
        const isMatch = this.compareObjectIds(pkgDestId, destinationId);
        console.log(`📝 Result: ${isMatch ? '✅ MATCH' : '❌ NO MATCH'}`);
        
        // If not a match, check similarity
        if (!isMatch) {
          // Calculate character by character similarity
          const minLength = Math.min(cleanPkgDestId.length, cleanDestId.length);
          let matchingChars = 0;
          
          for (let i = 0; i < minLength; i++) {
            if (cleanPkgDestId[i] === cleanDestId[i]) {
              matchingChars++;
            }
          }
          
          const similarity = matchingChars / minLength;
          console.log(`📊 Similarity: ${(similarity * 100).toFixed(1)}% (${matchingChars}/${minLength} matching characters)`);
          
          // Show where characters differ
          let diffStr = '';
          for (let i = 0; i < minLength; i++) {
            diffStr += cleanPkgDestId[i] === cleanDestId[i] ? '.' : 'X';
          }
          console.log(`🔍 Differences: ${diffStr} (X = different, . = same)`);
        }
      });
      
    } catch (error) {
      console.error("❌ Error in debugging destination ID matching:", error);
    }
  }

  /**
   * Get packages by destination ID with format correction
   * This tries various formats of the destination ID to find matches
   */
  static async getPackagesByDestinationWithFormatFix(destinationId: string): Promise<ITourPackage[]> {
    try {
      console.log(`🔄 Attempting to find packages with format-corrected ID: ${destinationId}`);
      
      // Get all packages
      const allPackages = await this.getAllPackages();
      
      // First try with the original ID
      let filteredPackages = allPackages.filter(pkg => {
        if (!pkg.destination || !pkg.destination._id) return false;
        return this.compareObjectIds(pkg.destination._id.toString(), destinationId);
      });
      
      // If no results, try with cleaned ID (removing non-hex chars)
      if (filteredPackages.length === 0) {
        console.log("🔧 No matches with original ID format, trying with cleaned format");
        const cleanDestId = destinationId.replace(/[^a-fA-F0-9]/g, '');
        
        filteredPackages = allPackages.filter(pkg => {
          if (!pkg.destination || !pkg.destination._id) return false;
          const cleanPkgDestId = pkg.destination._id.toString().replace(/[^a-fA-F0-9]/g, '');
          return cleanPkgDestId === cleanDestId;
        });
      }
      
      // If still no results, try high similarity matching (for IDs that differ only slightly)
      if (filteredPackages.length === 0) {
        console.log("🔧 No matches with cleaned format, trying high similarity matching");
        
        const cleanDestId = destinationId.replace(/[^a-fA-F0-9]/g, '');
        if (cleanDestId.length === 24) { // Only for valid ObjectId format
          const similarityThreshold = 90; // Match IDs with 90%+ similarity (e.g. differ in just 1-2 chars)
          
          // Find packages with very similar destination IDs
          const similarIdPackages = allPackages.filter(pkg => {
            if (!pkg.destination || !pkg.destination._id) return false;
            
            const cleanPkgDestId = pkg.destination._id.toString().replace(/[^a-fA-F0-9]/g, '');
            if (cleanPkgDestId.length !== 24) return false;
            
            // Calculate similarity percentage
            let matchingChars = 0;
            for (let i = 0; i < 24; i++) {
              if (cleanPkgDestId[i] === cleanDestId[i]) matchingChars++;
            }
            
            const similarityPercentage = (matchingChars / 24) * 100;
            console.log(`📊 Package ${pkg._id} similarity: ${similarityPercentage.toFixed(1)}%`);
            
            return similarityPercentage >= similarityThreshold;
          });
          
          if (similarIdPackages.length > 0) {
            console.log(`✅ Found ${similarIdPackages.length} packages with high similarity (>=${similarityThreshold}%)`);
            filteredPackages = similarIdPackages;
          }
        }
      }
      
      // If still found no packages, and the ID length looks like a valid ObjectID (24 chars),
      // try matching just by the visible part of the ID as a substring
      if (filteredPackages.length === 0) {
        console.log("🔧 No matches with similarity matching, trying substring matching");
        
        const cleanDestId = destinationId.replace(/[^a-fA-F0-9]/g, '');
        if (cleanDestId.length > 10) { // At least have some significant portion of the ID
          filteredPackages = allPackages.filter(pkg => {
            if (!pkg.destination || !pkg.destination._id) return false;
            const pkgDestId = pkg.destination._id.toString().replace(/[^a-fA-F0-9]/g, '');
            return pkgDestId.includes(cleanDestId) || cleanDestId.includes(pkgDestId);
          });
        }
      }
      
      // If we still found no packages, as a last resort, get packages with similar prefix
      // This handles cases where the destination ID prefix is the same (e.g. first 20 chars match)
      if (filteredPackages.length === 0) {
        console.log("🔧 No matches with substring matching, trying prefix matching");
        
        const cleanDestId = destinationId.replace(/[^a-fA-F0-9]/g, '');
        if (cleanDestId.length === 24) { // Only for valid ObjectId format
          const prefixLength = 20; // Match first 20 characters of ID
          const destIdPrefix = cleanDestId.substring(0, prefixLength);
          
          filteredPackages = allPackages.filter(pkg => {
            if (!pkg.destination || !pkg.destination._id) return false;
            const cleanPkgDestId = pkg.destination._id.toString().replace(/[^a-fA-F0-9]/g, '');
            const pkgIdPrefix = cleanPkgDestId.substring(0, prefixLength);
            return pkgIdPrefix === destIdPrefix;
          });
          
          if (filteredPackages.length > 0) {
            console.log(`✅ Found ${filteredPackages.length} packages with matching prefix (first ${prefixLength} chars)`);
          }
        }
      }
      
      console.log(`✅ Found ${filteredPackages.length} packages after format correction`);
      return filteredPackages;
      
    } catch (error) {
      console.error("❌ Error in finding packages with format correction:", error);
      return [];
    }
  }

  /**
   * Debug utility to log the raw package and destination data
   * This is useful for seeing the exact format of IDs in the data
   */
  static async logRawPackageData(): Promise<void> {
    try {
      console.log(`🧪 DEBUG: Getting raw package data`);
      
      // Make a direct API call to bypass any processing
      const response = await axios.get("/package");
      const rawPackages = response.data;
      
      if (!Array.isArray(rawPackages) || rawPackages.length === 0) {
        console.log("❌ No packages found in raw API response");
        return;
      }
      
      console.log(`📦 Found ${rawPackages.length} packages in raw API response`);
      
      // Log the first package with its destination
      const samplePackage = rawPackages[0];
      console.log("📝 Sample package data structure:");
      console.log(JSON.stringify({
        _id: samplePackage._id,
        name: samplePackage.nama,
        destination: {
          _id: samplePackage.destination?._id,
          name: samplePackage.destination?.nama
        }
      }, null, 2));
      
      // Show all destination IDs in their raw format
      console.log("\n📋 All destination IDs from raw packages:");
      rawPackages.forEach((pkg, index) => {
        if (pkg.destination && pkg.destination._id) {
          console.log(`${index+1}. Package: ${pkg.nama}`);
          console.log(`   Destination: ${pkg.destination.nama}`);
          console.log(`   ID: ${pkg.destination._id}`);
          console.log(`   Type: ${typeof pkg.destination._id}`);
          console.log(`   Raw representation: ${JSON.stringify(pkg.destination._id)}`);
          console.log("---");
        }
      });
      
    } catch (error) {
      console.error("❌ Error logging raw package data:", error);
    }
  }

  /**
   * This method will find packages that have destination IDs similar to the input ID
   * This is specifically designed to handle cases where a destination ID in the URL 
   * is slightly different from the actual IDs in the database
   */
  static async findPackagesByAlmostMatchingDestination(searchId: string): Promise<{
    packages: ITourPackage[],
    matchedId: string | null,
    matchType: 'exact' | 'high-similarity' | 'prefix' | 'none'
  }> {
    try {
      console.log(`🎯 Searching for packages with destination ID similar to: ${searchId}`);
      
      // Normalize the search ID
      const cleanSearchId = searchId.replace(/[^a-fA-F0-9]/g, '');
      if (!cleanSearchId || cleanSearchId.length !== 24) {
        console.log("❌ Invalid ObjectId format for search");
        return { packages: [], matchedId: null, matchType: 'none' };
      }
      
      // Get all packages
      const allPackages = await this.getAllPackages();
      if (allPackages.length === 0) {
        return { packages: [], matchedId: null, matchType: 'none' };
      }
      
      // Extract unique destination IDs from packages
      const uniqueDestIds: Map<string, {
        id: string,
        similarity: number,
        packages: ITourPackage[]
      }> = new Map();
      
      allPackages.forEach(pkg => {
        if (!pkg.destination || !pkg.destination._id) return;
        
        const destId = pkg.destination._id.toString();
        const cleanDestId = destId.replace(/[^a-fA-F0-9]/g, '');
        
        if (cleanDestId.length !== 24) return;
        
        // Calculate similarity
        let matchingChars = 0;
        for (let i = 0; i < 24; i++) {
          if (cleanDestId[i] === cleanSearchId[i]) matchingChars++;
        }
        const similarity = (matchingChars / 24) * 100;
        
        // Add or update in our map
        if (uniqueDestIds.has(destId)) {
          uniqueDestIds.get(destId)?.packages.push(pkg);
        } else {
          uniqueDestIds.set(destId, {
            id: destId,
            similarity,
            packages: [pkg]
          });
        }
      });
      
      // Convert to array and sort by similarity
      const sortedDestIds = Array.from(uniqueDestIds.values())
        .sort((a, b) => b.similarity - a.similarity);
      
      // Output the top 5 most similar destination IDs
      console.log("🏆 Most similar destination IDs:");
      sortedDestIds.slice(0, 5).forEach((item, i) => {
        console.log(`${i+1}. ID: ${item.id} - Similarity: ${item.similarity.toFixed(1)}% (${item.packages.length} packages)`);
      });
      
      // First check for exact match
      const exactMatch = sortedDestIds.find(item => item.similarity === 100);
      if (exactMatch) {
        console.log(`✅ Found exact match: ${exactMatch.id} with ${exactMatch.packages.length} packages`);
        return {
          packages: exactMatch.packages,
          matchedId: exactMatch.id,
          matchType: 'exact'
        };
      }
      
      // Then check for high similarity (95%+)
      const highSimilarityMatch = sortedDestIds.find(item => item.similarity >= 95);
      if (highSimilarityMatch) {
        console.log(`✅ Found high similarity match: ${highSimilarityMatch.id} (${highSimilarityMatch.similarity.toFixed(1)}%) with ${highSimilarityMatch.packages.length} packages`);
        return {
          packages: highSimilarityMatch.packages,
          matchedId: highSimilarityMatch.id,
          matchType: 'high-similarity'
        };
      }
      
      // Finally check for prefix match (first 20 chars match)
      const prefixLength = 20;
      const searchIdPrefix = cleanSearchId.substring(0, prefixLength);
      const prefixMatch = sortedDestIds.find(item => {
        const cleanId = item.id.replace(/[^a-fA-F0-9]/g, '');
        return cleanId.substring(0, prefixLength) === searchIdPrefix;
      });
      
      if (prefixMatch) {
        console.log(`✅ Found prefix match: ${prefixMatch.id} with ${prefixMatch.packages.length} packages`);
        return {
          packages: prefixMatch.packages,
          matchedId: prefixMatch.id,
          matchType: 'prefix'
        };
      }
      
      console.log("❌ No matching destination found");
      return { packages: [], matchedId: null, matchType: 'none' };
      
    } catch (error) {
      console.error("❌ Error in finding packages by almost matching destination:", error);
      return { packages: [], matchedId: null, matchType: 'none' };
    }
  }

  /**
   * Mencari paket wisata berdasarkan nama destinasi
   * Pendekatan yang lebih sederhana: mencari berdasarkan nama, bukan ID
   */
  static async getPackagesByDestinationName(destinationName: string): Promise<ITourPackage[]> {
    try {
      console.log(`🔍 Mencari paket wisata untuk destinasi: "${destinationName}"`);
      
      // Ambil semua paket
      const allPackages = await this.getAllPackages();
      
      if (!destinationName) {
        console.log("❌ Nama destinasi kosong");
        return [];
      }
      
      // Bersihkan dan normalisasi nama destinasi untuk perbandingan
      const normalizedSearchName = destinationName.toLowerCase().trim()
        // Remove any special characters that might interfere with matching
        .replace(/[^\w\s]/g, '')
        // Replace multiple spaces with single spaces
        .replace(/\s+/g, ' ');
      
      // Split search name into words for partial matching
      const searchWords = normalizedSearchName.split(' ').filter(word => word.length > 2);
      console.log(`🔍 Keyword pencarian: [${searchWords.join(', ')}]`);
      
      // Filter paket berdasarkan nama destinasi
      const filteredPackages = allPackages.filter(pkg => {
        if (!pkg.destination) {
          return false;
        }
        
        // Normalisasi nama dan lokasi destinasi dari paket
        const pkgDestName = (pkg.destination.nama || '').toLowerCase().trim()
          .replace(/[^\w\s]/g, '').replace(/\s+/g, ' ');
          
        const pkgDestLocation = (pkg.destination.lokasi || '').toLowerCase().trim()
          .replace(/[^\w\s]/g, '').replace(/\s+/g, ' ');
          
        // 1. Exact match with the name
        if (pkgDestName === normalizedSearchName) {
          return true;
        }
        
        // 2. Name contains search term or search term contains name
        if (pkgDestName.includes(normalizedSearchName) || 
            normalizedSearchName.includes(pkgDestName)) {
          return true;
        }
        
        // 3. Match with the location
        if (pkgDestLocation.includes(normalizedSearchName) ||
            normalizedSearchName.includes(pkgDestLocation)) {
          return true;
        }
        
        // 4. Check if most of the search words match
        let matchingWords = 0;
        for (const word of searchWords) {
          if (pkgDestName.includes(word) || pkgDestLocation.includes(word)) {
            matchingWords++;
          }
        }
        
        // If at least half of the search words match, consider it a match
        if (searchWords.length > 1 && matchingWords >= Math.ceil(searchWords.length / 2)) {
          console.log(`📝 Partial match: "${pkg.destination.nama}" matched ${matchingWords}/${searchWords.length} keywords`);
          return true;
        }
        
        return false;
      });
      
      console.log(`✅ Ditemukan ${filteredPackages.length} paket wisata untuk destinasi "${destinationName}"`);
      
      if (filteredPackages.length === 0) {
        console.log(`📝 Mencoba pencarian lebih fleksibel...`);
        
        // Jika tidak ditemukan paket dengan filter yang lebih ketat,
        // lakukan pencarian lebih fleksibel dengan kata kunci individual
        if (searchWords.length > 1) {
          const flexibleMatches = allPackages.filter(pkg => {
            if (!pkg.destination || !pkg.destination.nama) return false;
            
            const pkgDestName = pkg.destination.nama.toLowerCase();
            const pkgDestLocation = (pkg.destination.lokasi || '').toLowerCase();
            
            // Check if ANY of the search words match
            return searchWords.some(word => 
              pkgDestName.includes(word) || pkgDestLocation.includes(word)
            );
          });
          
          console.log(`✅ Ditemukan ${flexibleMatches.length} paket wisata dengan pencarian fleksibel`);
          return flexibleMatches;
        }
      }
      
      return filteredPackages;
      
    } catch (error) {
      console.error(`❌ Error mencari paket berdasarkan nama destinasi:`, error);
      return [];
    }
  }
}
