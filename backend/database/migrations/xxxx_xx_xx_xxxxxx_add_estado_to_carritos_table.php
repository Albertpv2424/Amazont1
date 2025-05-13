public function up()
{
    Schema::table('carritos', function (Blueprint $table) {
        $table->string('estado')->default('pendiente'); // Add the estado column
    });
}

public function down()
{
    Schema::table('carritos', function (Blueprint $table) {
        $table->dropColumn('estado');
    });
}