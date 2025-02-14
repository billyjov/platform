import { ENVIRONMENT_INITIALIZER, inject, Provider } from '@angular/core';
import {
  _createRouterConfig,
  _ROUTER_CONFIG,
  ROUTER_CONFIG,
  RouterState,
  StoreRouterConfig,
} from './router_store_config';
import {
  FullRouterStateSerializer,
  SerializedRouterStateSnapshot,
} from './serializers/full_serializer';
import { MinimalRouterStateSerializer } from './serializers/minimal_serializer';
import {
  BaseRouterStoreState,
  RouterStateSerializer,
} from './serializers/base';
import { StoreRouterConnectingService } from './store_router_connecting.service';
import { EnvironmentProviders } from '@ngrx/store';

/**
 * Connects the Angular Router to the Store.
 *
 * @usageNotes
 *
 * ```ts
 * bootstrapApplication(AppComponent, {
 *   providers: [provideRouterStore()],
 * });
 * ```
 */
export function provideRouterStore<
  T extends BaseRouterStoreState = SerializedRouterStateSnapshot
>(config: StoreRouterConfig<T> = {}): EnvironmentProviders {
  return {
    ɵproviders: [
      { provide: _ROUTER_CONFIG, useValue: config },
      {
        provide: ROUTER_CONFIG,
        useFactory: _createRouterConfig,
        deps: [_ROUTER_CONFIG],
      },
      {
        provide: RouterStateSerializer,
        useClass: config.serializer
          ? config.serializer
          : config.routerState === RouterState.Full
          ? FullRouterStateSerializer
          : MinimalRouterStateSerializer,
      },
      {
        provide: ENVIRONMENT_INITIALIZER,
        multi: true,
        useFactory() {
          return () => inject(StoreRouterConnectingService);
        },
      },
      StoreRouterConnectingService,
    ],
  };
}
