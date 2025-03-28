import type { Plugin, Strapi, CoreApi, Common } from '@strapi/strapi';
import type { Database } from '@strapi/database';
import type { env } from '@strapi/utils';
import type { ExtractIdentityFunction, ExtractObject } from '@jagaad/utils';

type LifecycleProvider = Database['lifecycles'];

/**
 * https://docs-v4.strapi.io/dev-docs/backend-customization/models#lifecycle-hooks
 */
export type LifecycleSubscriber = Parameters<LifecycleProvider['subscribe']>[0];
export type SubscriberFn = ExtractIdentityFunction<LifecycleSubscriber>;
export type Event = Parameters<SubscriberFn>[0];
export interface EventExtended<T> extends Event {
	result?: T;
}

/**
 * https://docs-v4.strapi.io/dev-docs/configurations/environment/#casting-environment-variables
 */
export type Env = typeof env;

export type PluginRoutes = Plugin.Config.ServerObject['routes'];
export type RouterObjectNotation = ExtractObject<PluginRoutes>[string] & {
	// Missing in Strapi types
	prefix?: string | undefined;
};

export type FactoryOptions = {
	strapi: Strapi;
};

export type CollectionServiceFactory<
	T extends (options: FactoryOptions) => unknown,
> = (options: FactoryOptions) => CoreApi.Service.CollectionType & ReturnType<T>;

export type SingleServiceFactory<
	T extends (options: FactoryOptions) => unknown,
> = (options: FactoryOptions) => CoreApi.Service.SingleType & ReturnType<T>;

// TODO: Create official @jagaad/strapi-utils-v4 package
export function extendRouter(
	router: CoreApi.Router.Router,
	customRoutes: Common.RouteInput[],
): CoreApi.Router.Router {
	let routes: CoreApi.Router.Route[];
	// @ts-expect-error exactOptionalPropertyTypes
	return {
		type: router.type,
		prefix: router.prefix,
		get routes() {
			if (!routes) {
				// @ts-expect-error CoreApi.Router.Router#routes is actually an array
				routes = [...router.routes, ...customRoutes];
			}

			return routes;
		},
	};
}
