<?php

namespace App\Http\Controllers;

use App\Models\ContactList;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ContactListController extends Controller
{
    public function index(): Response
    {
        $lists = ContactList::withCount('contacts')->get();
        return Inertia::render('Lists/Index', [
            'lists' => $lists
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255'
        ]);

        ContactList::create($request->all());

        return redirect()->back();
    }

    public function update(Request $request, ContactList $list)
    {
        $request->validate([
            'name' => 'required|string|max:255'
        ]);

        $list->update($request->all());

        return redirect()->back();
    }

    public function destroy(ContactList $list)
    {
        $list->delete();

        return redirect()->back();
    }

    public function show(ContactList $list): Response
    {
        $list->load('contacts');
        return Inertia::render('Lists/Show', [
            'list' => $list
        ]);    
    }
}