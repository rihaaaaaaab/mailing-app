<?php

namespace App\Http\Controllers;

use App\Models\Template;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Purifier;

class TemplateController extends Controller
{
    public function index(): Response
    {
        $templates = Template::all();
        return Inertia::render('Templates/Index', [
            'templates' => $templates,
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'content' => 'nullable|string',
            'design' => 'nullable|json', // Validate design as JSON
        ]);

        $data['content'] = Purifier::clean($data['content']); // Sanitize HTML

        Template::create($data);

        return redirect()->back()->with('success', 'Template created successfully!');
    }

    public function update(Request $request, Template $template)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'content' => 'nullable|string',
            'design' => 'nullable|json', // Validate design as JSON
        ]);

        $data['content'] = Purifier::clean($data['content']); // Sanitize HTML

        $template->update($data);

        return redirect()->back()->with('success', 'Template updated successfully!');
    }

    public function destroy(Template $template)
    {
        $template->delete();

        return redirect()->back()->with('success', 'Template deleted successfully!');
    }

}