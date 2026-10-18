/**
 * Generic Dataset Ingestion Interface
 * 
 * Designed to ingest external educational and opportunity datasets
 * (e.g. DIKSHA, SWAYAM, Skill India) into the NextLearning platform
 * with strict provenance, duplicate detection, and schema validation.
 */

export interface DatasetImportResult {
  datasetName: string;
  sourceFile: string;
  totalRecordsProcessed: number;
  importedCount: number;
  skippedCount: number;
  rejectedCount: number;
  issues: Array<{
    row: number;
    reason: string;
    rawRecord?: unknown;
  }>;
}

export interface IngestionOptions {
  datasetName: string;
  sourceFile: string;
  batchSize?: number;
  dryRun?: boolean;
}
