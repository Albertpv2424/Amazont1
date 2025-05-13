<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('categoria_producto', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('categoria_id');
            $table->unsignedBigInteger('producto_id');
            $table->timestamps();

            $table->foreign('categoria_id')->references('id_cat')->on('categorias')->onDelete('cascade');
            $table->foreign('producto_id')->references('id_prod')->on('productos')->onDelete('cascade');
            $table->unique(['categoria_id', 'producto_id']);
        });
    }

    public function down()
    {
        Schema::dropIfExists('categoria_producto');
    }
};