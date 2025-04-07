/**
 * Example: Manage Realm Localization
 *
 * This example demonstrates how to manage localization settings
 * for a Keycloak realm using the Admin SDK.
 */

import KeycloakClient from '../../src';
import { config } from '../config'; // Main execution

// Main execution
(async () => {
  try {
    // Initialize the SDK
    const sdk = new KeycloakClient(config);

    // Get supported locales
    const locales = await sdk.realms.getLocalizationLocales(config.realm);

    // Define a locale to work with
    const locale = 'en';

    // Get localization texts for the locale

    try {
      const texts = await sdk.realms.getLocalizationTexts(config.realm, locale);

      console.log(JSON.stringify(texts, null, 2));
    } catch (error) {}

    // Add or update localization texts

    const newTexts = {
      welcome: 'Welcome to our custom Keycloak instance',
      loginTitle: 'Sign in to your account',
      loginTitleHtml: '<div>Sign in to your account</div>',
      customMessage: 'This text was added via the Admin SDK'
    };

    await sdk.realms.addLocalizationTexts(config.realm, locale, newTexts);

    // Get specific localization text

    try {
      const text = await sdk.realms.getLocalizationText(config.realm, locale, 'customMessage');
    } catch (error) {
      console.log(
        `Failed to get text for 'customMessage': ${error instanceof Error ? error.message : String(error)}`
      );
    }

    // Update specific localization text

    await sdk.realms.updateLocalizationText(
      config.realm,
      locale,
      'customMessage',
      'This text was updated via the Admin SDK'
    );

    // Get updated localization text

    try {
      const updatedText = await sdk.realms.getLocalizationText(
        config.realm,
        locale,
        'customMessage'
      );
    } catch (error) {
      console.log(
        `Failed to get updated text for 'customMessage': ${error instanceof Error ? error.message : String(error)}`
      );
    }

    // Delete specific localization text

    await sdk.realms.deleteLocalizationText(config.realm, locale, 'customMessage');

    // Get updated localization texts to verify changes

    try {
      const updatedTexts = await sdk.realms.getLocalizationTexts(config.realm, locale);

      console.log(JSON.stringify(updatedTexts, null, 2));
    } catch (error) {}

    // Note: Uncomment the following to delete all localization texts for the locale
    //
    // await sdk.realms.deleteLocalizationTexts(config.realm, locale);
    //
  } catch (error) {
    console.error('Error:', error instanceof Error ? error.message : String(error));
  }
})();
