import { DeepPartial } from './types.js';
import { copyObject, isObject } from './utils.js';

export class ConfigStore<T> {
  private config: T;
  private readonly defaults: T;

  constructor(defaults: T, overrides?: DeepPartial<T>) {
    this.config = copyObject(defaults);
    this.defaults = copyObject(defaults);

    if (overrides) {
      this.setConfig(overrides);
    }
  }

  public setConfig(overrides: DeepPartial<T>): void {
    this.config = this.mapObjectWithOverridesAndDefaults<T>(
      this.config,
      overrides as T,
      this.defaults
    );
  }

  public getConfig(): T {
    return copyObject(this.config);
  }

  public resetToDefaults(): void {
    // This will suffice since we don't have any functions here.
    this.config = copyObject(this.defaults);
  }

  /**
   * Modifies an original object with overrides and defaults for those keys that are not set (undefined)
   * @param obj original object
   * @param overrides object with overridden fields
   * @param defaults defaults
   */
  private mapObjectWithOverridesAndDefaults<T>(
    obj: T,
    overrides: Partial<T>,
    defaults: T
  ): T {
    for (const key in overrides) {
      const typedKey = key as keyof typeof overrides;

      // get overridden values
      let value = overrides[typedKey];

      // in case in modifiable object field is not defined, we just assign it
      if (!obj[typedKey]) {
        obj = {
          ...obj,
          [typedKey]: value
        };
        continue;
      }

      // recursively handle nested objects
      if (isObject(value)) {
        obj = {
          ...obj,
          [typedKey]: this.mapObjectWithOverridesAndDefaults(
            obj[typedKey],
            value,
            defaults[typedKey]
          )
        };
        continue;
      }

      // if it's an undefined grab by key from defaults
      if (!value) {
        value = defaults[typedKey];
      }

      obj[typedKey] = value as T[keyof T];
    }

    return obj;
  }
}
