package com.androidphonenumberhint

import android.app.Activity
import android.content.Intent
import android.content.IntentSender
import android.util.Log
import com.facebook.react.bridge.*
import com.facebook.react.module.annotations.ReactModule
import com.google.android.gms.auth.api.identity.GetPhoneNumberHintIntentRequest
import com.google.android.gms.auth.api.identity.Identity
import com.facebook.react.turbomodule.core.interfaces.TurboModule
import android.provider.Settings
import com.google.android.gms.common.api.ApiException
import com.google.android.gms.common.api.CommonStatusCodes
import android.os.Build
import androidx.appcompat.app.AlertDialog
import com.google.android.gms.common.api.ResolvableApiException


@ReactModule(name = AndroidPhoneNumberHintModule.NAME)
class AndroidPhoneNumberHintModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext), TurboModule {

  private var mPromise: Promise? = null
  private var mShowGuidanceDialog: Boolean = false

  init {
    reactContext.addActivityEventListener(object : BaseActivityEventListener() {
      override fun onActivityResult(activity: Activity, requestCode: Int, resultCode: Int, data: Intent?) {
        if (requestCode == REQUEST_CODE) {
          val promise = mPromise
          mPromise = null
          mShowGuidanceDialog = false

          if (resultCode == Activity.RESULT_OK && data != null) {
            try {
              val phoneNumber = Identity.getSignInClient(activity).getPhoneNumberFromIntent(data)
              Log.d(TAG, "Phone number retrieved successfully: $phoneNumber")
              promise?.resolve(phoneNumber)
            } catch (e: Exception) {
              Log.e(TAG, "Failed to get phone number from intent", e)
              promise?.reject("GET_PHONE_ERROR", "Failed to get phone number: ${e.message}")
            }
          } else {
            Log.w(TAG, "Phone number hint cancelled or failed. ResultCode: $resultCode")
            promise?.reject("USER_CANCELLED", "User cancelled phone number selection")
          }
        }
      }
    })
  }

  override fun getName(): String {
    return NAME
  }

  /**
   * Shows the phone number hint picker with options.
   * @param options ReadableMap containing:
   *   - showGuidanceDialog: Boolean (default: false) - Whether to show guidance dialog on error
   * @param promise Promise to resolve with phone number or reject with error
   */
  @ReactMethod
  fun showPhoneNumberHint(options: ReadableMap?, promise: Promise) {
    if (mPromise != null) {
      promise.reject("ALREADY_IN_PROGRESS", "Phone number hint request already in progress")
      return
    }

    mPromise = promise
    mShowGuidanceDialog = options?.getBoolean("showGuidanceDialog") ?: false
    
    val activity = reactApplicationContext.currentActivity
    if (activity == null) {
      mPromise = null
      mShowGuidanceDialog = false
      promise.reject("NO_ACTIVITY", "Activity is null")
      return
    }

    val request = GetPhoneNumberHintIntentRequest.builder().build()
    Identity.getSignInClient(activity)
      .getPhoneNumberHintIntent(request)
      .addOnSuccessListener { pendingIntent ->
        try {
          Log.d(TAG, "Starting phone number hint intent")
          activity.startIntentSenderForResult(
            pendingIntent.intentSender,
            REQUEST_CODE,
            null,
            0,
            0,
            0
          )
        } catch (e: IntentSender.SendIntentException) {
          Log.e(TAG, "Failed to start phone number hint intent", e)
          mPromise?.reject("INTENT_ERROR", "Failed to start phone number hint: ${e.message}")
          mPromise = null
          mShowGuidanceDialog = false
        }
      }
      .addOnFailureListener { e ->
        Log.e(TAG, "Failed to get phone number hint intent", e)
        handleApiFailure(e, activity)
      }
  }

  private fun handleApiFailure(exception: Exception, activity: Activity) {
    val errorCode = when (exception) {
      is ApiException -> exception.statusCode
      else -> -1
    }

    Log.e(TAG, "Phone Number Hint API failure. Error code: $errorCode, Exception: ${exception.message}")

    // Create detailed error info for JavaScript side
    val errorDetails = WritableNativeMap().apply {
      putInt("statusCode", errorCode)
      putString("message", exception.message)
    }

    when (errorCode) {
      CommonStatusCodes.RESOLUTION_REQUIRED -> {
        // This usually means user needs to enable phone number sharing
        if (mShowGuidanceDialog) {
          showAutofillGuidance(activity)
        }
        mPromise?.reject(
          "RESOLUTION_REQUIRED",
          "Phone number hints disabled. Please enable in Settings → Google → Phone number sharing.",
          exception
        )
      }
      CommonStatusCodes.API_NOT_CONNECTED -> {
        if (mShowGuidanceDialog) {
          showAutofillGuidance(activity)
        }
        mPromise?.reject(
          "API_NOT_CONNECTED",
          "Google Play Services not connected. Please enable phone number hints in settings.",
          exception
        )
      }
      CommonStatusCodes.DEVELOPER_ERROR -> {
        mPromise?.reject(
          "DEVELOPER_ERROR",
          "API configuration error: ${exception.message}",
          exception
        )
      }
      CommonStatusCodes.NETWORK_ERROR -> {
        mPromise?.reject(
          "NETWORK_ERROR",
          "Network error occurred: ${exception.message}",
          exception
        )
      }
      CommonStatusCodes.SIGN_IN_REQUIRED -> {
        mPromise?.reject(
          "SIGN_IN_REQUIRED",
          "Google account sign-in required",
          exception
        )
      }
      else -> {
        // For unknown errors, optionally show guidance as it might be a settings issue
        if (mShowGuidanceDialog) {
          showAutofillGuidance(activity)
        }
        mPromise?.reject(
          "UNKNOWN_ERROR",
          "Phone number hint failed: ${exception.message}. Error code: $errorCode",
          exception
        )
      }
    }
    mPromise = null
    mShowGuidanceDialog = false
  }

  /**
   * Shows a guidance dialog to help users enable phone number hints.
   * This is only called when showGuidanceDialog option is true.
   */
  private fun showAutofillGuidance(activity: Activity) {
    Log.d(TAG, "Showing autofill guidance dialog")
    try {
      AlertDialog.Builder(activity)
        .setTitle("Enable Phone Number Hints")
        .setMessage("To use phone number hints, please enable phone number sharing:\n\n• Settings → Google → All services → Phone number sharing\n• OR Settings → System → Languages & input → Advanced → Autofill service → Google\n• OR Settings → Google → Autofill → Google\n\nAlso ensure you have a phone number saved in your Google account.")
        .setPositiveButton("Open Settings") { _, _ ->
          openAutofillSettings(activity)
        }
        .setNegativeButton("Cancel", null)
        .setCancelable(true)
        .show()
    } catch (e: Exception) {
      Log.e(TAG, "Failed to show autofill guidance dialog", e)
    }
  }

  private fun openAutofillSettings(activity: Activity) {
    try {
      Log.d(TAG, "Opening autofill settings")
      val intent = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
        Intent(Settings.ACTION_REQUEST_SET_AUTOFILL_SERVICE)
      } else {
        Intent(Settings.ACTION_SETTINGS)
      }
      activity.startActivity(intent)
    } catch (e: Exception) {
      Log.e(TAG, "Failed to open autofill settings, falling back to general settings", e)
      try {
        activity.startActivity(Intent(Settings.ACTION_SETTINGS))
      } catch (fallbackException: Exception) {
        Log.e(TAG, "Failed to open any settings", fallbackException)
      }
    }
  }

  companion object {
    private const val TAG = "AndroidPhoneNumberHint"
    private const val REQUEST_CODE = 1001
    const val NAME = "AndroidPhoneNumberHint"
  }
}
