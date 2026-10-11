export { SailpointPluginService } from './sailpoint-plugin.service';

// Re-export the SDK context types plugin authors commonly type against, so they
// import them from '@core' rather than reaching into '@sailpoint/ui-plugin-sdk'.
export type {
  PageContext,
  PluginContext,
  SlotContext,
  TenantContext,
  UserContext,
} from '@sailpoint/ui-plugin-sdk';
