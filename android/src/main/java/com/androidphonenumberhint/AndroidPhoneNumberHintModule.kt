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

@ReactModule(name = AndroidPhoneNumberHintModule.NAME)
class AndroidPhoneNumberHintModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext), TurboModule {

    private var mPromise: Promise? = null

    init {
        reactContext.addActivityEventListener(object : BaseActivityEventListener() {
            override fun onActivityResult(activity: Activity, requestCode: Int, resultCode: Int, data: Intent?) {
                if (requestCode == REQUEST_CODE) {
                    if (resultCode == Activity.RESULT_OK && data != null) {
                        try {
                            val phoneNumber = Identity.getSignInClient(activity).getPhoneNumberFromIntent(data)
                            mPromise?.resolve(phoneNumber)
                        } catch (e: Exception) {
                            mPromise?.reject("ERROR", "Failed to get phone number: ${e.message}")
                        }
                    } else {
                        mPromise?.reject("ERROR", "User cancelled or error occurred")
                    }
                    mPromise = null
                }
            }
        })
    }

    override fun getName(): String {
        return NAME
    }

    @ReactMethod
    fun showPhoneNumberHint(promise: Promise) {
        mPromise = promise
        val activity = currentActivity
        if (activity == null) {
            promise.reject("ERROR", "Activity is null")
            return
        }

        val request = GetPhoneNumberHintIntentRequest.builder().build()
        Identity.getSignInClient(activity)
            .getPhoneNumberHintIntent(request)
            .addOnSuccessListener { pendingIntent ->
                try {
                    activity.startIntentSenderForResult(
                        pendingIntent.intentSender,
                        REQUEST_CODE,
                        null,
                        0,
                        0,
                        0
                    )
                } catch (e: IntentSender.SendIntentException) {
                    Log.e(TAG, "Failed to start intent", e)
                    promise.reject("ERROR", "Failed to start intent: ${e.message}")
                }
            }
            .addOnFailureListener { e ->
                Log.e(TAG, "Failed to get pending intent", e)
                promise.reject("ERROR", "Failed to get pending intent: ${e.message}")
            }
    }

    companion object {
        private const val TAG = "AndroidPhoneNumberHint"
        private const val REQUEST_CODE = 1001
        const val NAME = "AndroidPhoneNumberHint"
    }
}
