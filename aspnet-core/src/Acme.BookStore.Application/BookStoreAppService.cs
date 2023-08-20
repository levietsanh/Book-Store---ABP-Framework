using System;
using System.Collections.Generic;
using System.Text;
using Acme.BookStore.Books;
using Acme.BookStore.Localization;
using Acme.BookStore.Permissions;
using Volo.Abp.Application.Dtos;
using Volo.Abp.Application.Services;
using Volo.Abp.Domain.Repositories;

namespace Acme.BookStore;

/* Inherit your application services from this class.
 */
public class BookStoreAppService : CrudAppService<
                                       Book, // the Book entity
                                       BookDto, // uses show books
                                       Guid, //Primary key of the book entity
                                       PagedAndSortedResultRequestDto, // paging/sorting
                                       CreateUpdateBookDto>, //create/update a book
                                       IBookAppService //implement the IBookAppService
{
    public BookStoreAppService(IRepository<Book, Guid> repository) : base(repository)
    {
        GetPolicyName = BookStorePermissions.Books.Default;
        GetListPolicyName = BookStorePermissions.Books.Default;
        CreatePolicyName = BookStorePermissions.Books.Create;
        UpdatePolicyName = BookStorePermissions.Books.Edit;
        DeletePolicyName = BookStorePermissions.Books.Delete;
    }
}
