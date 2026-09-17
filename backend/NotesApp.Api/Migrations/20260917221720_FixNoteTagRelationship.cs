using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace NotesApp.Api.Migrations
{
    /// <inheritdoc />
    public partial class FixNoteTagRelationship : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "NoteTag",
                columns: table => new
                {
                    NotesId = table.Column<Guid>(type: "uuid", nullable: false),
                    TagsId = table.Column<Guid>(type: "uuid", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_NoteTag", x => new { x.NotesId, x.TagsId });
                    table.ForeignKey(
                        name: "FK_NoteTag_Notes_NotesId",
                        column: x => x.NotesId,
                        principalTable: "Notes",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_NoteTag_Tags_TagsId",
                        column: x => x.TagsId,
                        principalTable: "Tags",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.Sql("""
                INSERT INTO "NoteTag" ("NotesId", "TagsId")
                SELECT "NoteId", "Id"
                FROM "Tags"
                WHERE "NoteId" IS NOT NULL
                ON CONFLICT DO NOTHING;
                """);

            migrationBuilder.CreateIndex(
                name: "IX_NoteTag_TagsId",
                table: "NoteTag",
                column: "TagsId");

            migrationBuilder.DropForeignKey(
                name: "FK_Tags_Notes_NoteId",
                table: "Tags");

            migrationBuilder.DropForeignKey(
                name: "FK_Tags_Tags_TagId",
                table: "Tags");

            migrationBuilder.DropIndex(
                name: "IX_Tags_NoteId",
                table: "Tags");

            migrationBuilder.DropIndex(
                name: "IX_Tags_TagId",
                table: "Tags");

            migrationBuilder.DropColumn(
                name: "NoteId",
                table: "Tags");

            migrationBuilder.DropColumn(
                name: "TagId",
                table: "Tags");

        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "NoteTag");

            migrationBuilder.AddColumn<Guid>(
                name: "NoteId",
                table: "Tags",
                type: "uuid",
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "TagId",
                table: "Tags",
                type: "uuid",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Tags_NoteId",
                table: "Tags",
                column: "NoteId");

            migrationBuilder.CreateIndex(
                name: "IX_Tags_TagId",
                table: "Tags",
                column: "TagId");

            migrationBuilder.AddForeignKey(
                name: "FK_Tags_Notes_NoteId",
                table: "Tags",
                column: "NoteId",
                principalTable: "Notes",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Tags_Tags_TagId",
                table: "Tags",
                column: "TagId",
                principalTable: "Tags",
                principalColumn: "Id");
        }
    }
}
