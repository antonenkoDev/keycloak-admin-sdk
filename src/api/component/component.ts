/**
 * Component API for Keycloak Admin SDK
 */
import KeycloakAdminSDK from '../../index';
import { ComponentRepresentation, ComponentTypeRepresentation } from '../../types/component';

/**
 * Component API class for managing Keycloak components
 */
export class ComponentApi {
  private sdk: KeycloakAdminSDK;

  /**
   * Constructor for ComponentApi
   *
   * @param sdk - KeycloakAdminSDK instance
   */
  constructor(sdk: KeycloakAdminSDK) {
    this.sdk = sdk;
  }

  /**
   * Get all components in a realm
   *
   * Endpoint: GET /admin/realms/{realm}/components
   *
   * @param realm - Realm name
   * @param options - Optional query parameters
   * @returns List of components
   */
  public async getComponents(
    realm: string,
    options?: {
      name?: string;
      parent?: string;
      type?: string;
    }
  ): Promise<ComponentRepresentation[]> {
    if (!realm) {
      throw new Error('Realm name is required');
    }

    try {
      return this.sdk.request<ComponentRepresentation[]>(`/components`, 'GET', undefined, options);
    } catch (error) {
      const errorDetails = error instanceof Error ? error.message : String(error);
      throw new Error(`Failed to get components: ${errorDetails}`);
    }
  }

  /**
   * Get a component by ID
   *
   * Endpoint: GET /admin/realms/{realm}/components/{id}
   *
   * @param realm - Realm name
   * @param id - Component ID
   * @returns Component
   */
  public async getComponent(realm: string, id: string): Promise<ComponentRepresentation> {
    if (!realm) {
      throw new Error('Realm name is required');
    }

    if (!id) {
      throw new Error('Component ID is required');
    }

    try {
      return this.sdk.request<ComponentRepresentation>(`/components/${id}`, 'GET');
    } catch (error) {
      const errorDetails = error instanceof Error ? error.message : String(error);
      throw new Error(`Failed to get component with ID ${id}: ${errorDetails}`);
    }
  }

  /**
   * Create a component
   *
   * Endpoint: POST /admin/realms/{realm}/components
   *
   * @param realm - Realm name
   * @param component - Component to create
   * @returns Created component
   */
  public async createComponent(realm: string, component: ComponentRepresentation): Promise<void> {
    if (!realm) {
      throw new Error('Realm name is required');
    }

    if (!component) {
      throw new Error('Component object is required');
    }

    if (!component.config?.editMode?.length || component.config.editMode.length < 1) {
      throw new Error('Edit mode is required');
    }

    // Create a deep copy to avoid modifying the original object
    const componentToSend = structuredClone(component);

    try {
      await this.sdk.request<void>(`/components`, 'POST', componentToSend);
    } catch (error) {
      const errorDetails = error instanceof Error ? error.message : String(error);
      console.error('Component creation error details:', error);
      throw new Error(`Failed to create component: ${errorDetails}`);
    }
  }

  /**
   * Update a component
   *
   * Endpoint: PUT /admin/realms/{realm}/components/{id}
   *
   * @param realm - Realm name
   * @param id - Component ID
   * @param component - Updated component
   */
  public async updateComponent(
    realm: string,
    id: string,
    component: ComponentRepresentation
  ): Promise<void> {
    if (!realm) {
      throw new Error('Realm name is required');
    }

    if (!id) {
      throw new Error('Component ID is required');
    }

    if (!component) {
      throw new Error('Component object is required');
    }

    if (!component.config?.editMode?.length || component.config.editMode.length < 1) {
      throw new Error('Edit mode is required');
    }

    try {
      await this.sdk.request<void>(`/components/${id}`, 'PUT', component);
    } catch (error) {
      const errorDetails = error instanceof Error ? error.message : String(error);
      console.error('Component update error details:', error);
      throw new Error(`Failed to update component with ID ${id}: ${errorDetails}`);
    }
  }

  /**
   * Delete a component
   *
   * Endpoint: DELETE /admin/realms/{realm}/components/{id}
   *
   * @param realm - Realm name
   * @param id - Component ID
   */
  public async deleteComponent(realm: string, id: string): Promise<void> {
    if (!realm) {
      throw new Error('Realm name is required');
    }

    if (!id) {
      throw new Error('Component ID is required');
    }

    try {
      await this.sdk.request<void>(`/components/${id}`, 'DELETE');
    } catch (error) {
      const errorDetails = error instanceof Error ? error.message : String(error);
      throw new Error(`Failed to delete component with ID ${id}: ${errorDetails}`);
    }
  }

  /**
   * Get sub-component types for a component
   *
   * Endpoint: GET /admin/realms/{realm}/components/{id}/sub-component-types
   *
   * @param realm - Realm name
   * @param id - Component ID
   * @param type - Required type parameter (e.g., 'org.keycloak.storage.UserStorageProvider')
   * @returns List of sub-component types
   */
  public async getSubComponentTypes(
    realm: string,
    id: string,
    type?: string
  ): Promise<ComponentTypeRepresentation[]> {
    if (!realm) {
      throw new Error('Realm name is required');
    }

    if (!id) {
      throw new Error('Component ID is required');
    }

    if (!type) {
      throw new Error('Subtype parameter is required');
    }

    try {
      return this.sdk.request<ComponentTypeRepresentation[]>(
        `/components/${id}/sub-component-types/?type=${type}`,
        'GET',
        undefined
      );
    } catch (error) {
      const errorDetails = error instanceof Error ? error.message : String(error);
      throw new Error(`Failed to get sub-component types for component ID ${id}: ${errorDetails}`);
    }
  }
}
