<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ContactMessage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ContactController extends Controller
{
    /**
     * Store a new contact message.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'subject' => 'nullable|string|max:255',
            'message' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['status' => 'error', 'errors' => $validator->errors()], 422);
        }

        $message = ContactMessage::create($request->all());

        return response()->json([
            'status' => 'success',
            'message' => 'Thank you! Your message has been received.',
            'data' => $message
        ]);
    }

    /**
     * Display a listing of messages (Admin only).
     */
    public function index(Request $request)
    {
        $this->authorizeAdmin($request);

        $messages = ContactMessage::latest()->paginate($request->per_page ?? 15);

        return response()->json([
            'status' => 'success',
            'data' => $messages
        ]);
    }

    /**
     * Mark message as read/replied.
     */
    public function updateStatus(Request $request, ContactMessage $contactMessage)
    {
        $this->authorizeAdmin($request);

        $validator = Validator::make($request->all(), [
            'status' => 'required|in:unread,read,replied',
        ]);

        if ($validator->fails()) {
            return response()->json(['status' => 'error', 'errors' => $validator->errors()], 422);
        }

        $contactMessage->update(['status' => $request->status]);

        return response()->json([
            'status' => 'success',
            'message' => "Message marked as {$request->status}",
            'data' => $contactMessage
        ]);
    }
    
    /**
     * Delete a message.
     */
    public function destroy(Request $request, ContactMessage $contactMessage)
    {
        $this->authorizeAdmin($request);
        
        $contactMessage->delete();
        
        return response()->json([
            'status' => 'success',
            'message' => 'Message deleted successfully'
        ]);
    }

    private function authorizeAdmin(Request $request)
    {
        if (!$request->user() || !$request->user()->isAdmin()) {
            abort(response()->json(['status' => 'error', 'message' => 'Admin access required'], 403));
        }
    }
}
