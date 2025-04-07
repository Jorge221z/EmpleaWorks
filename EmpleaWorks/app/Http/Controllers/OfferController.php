<?php

namespace App\Http\Controllers;

use App\Models\Offer;
use Illuminate\Http\Request;

class OfferController extends Controller
{
    /**
     * Get all offers as array.
     *
     * @return array
     */
    public function list()
    {
        $offers = Offer::with('company')->get()->toArray();
        
        return $offers;
    }

    /**
     * Get a specific offer with its company.
     *
     * @param  \App\Models\Offer  $offer
     * @return \App\Models\Offer
     */
    public function getOffer(Offer $offer)
    {
        $offer->load('company');
        return $offer;
    }
}