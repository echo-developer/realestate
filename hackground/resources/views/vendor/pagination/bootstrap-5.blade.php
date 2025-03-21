@if ($paginator->hasPages())
    <nav class="d-flex justify-content-between align-items-center mt-3 flex-wrap">
        
        <!-- Showing Results -->
        <p class="text-muted mb-2">
            Showing <strong>{{ $paginator->firstItem() }}</strong> to <strong>{{ $paginator->lastItem() }}</strong> 
            of <strong>{{ $paginator->total() }}</strong> entries
        </p>

        <!-- Bootstrap 5 Pagination -->
        <ul class="pagination pagination-sm mb-0">
            <!-- First Page -->
            @if ($paginator->currentPage() > 2)
                <li class="page-item">
                    <a href="{{ $paginator->url(1) }}" class="page-link">First</a>
                </li>
            @endif

            <!-- Previous Page -->
            <li class="page-item {{ $paginator->onFirstPage() ? 'disabled' : '' }}">
                <a href="{{ $paginator->previousPageUrl() }}" class="page-link">
                    &laquo;
                </a>
            </li>

            <!-- Page Numbers -->
            @foreach ($elements as $element)
                @if (is_string($element))
                    <li class="page-item disabled"><span class="page-link">{{ $element }}</span></li>
                @endif

                @if (is_array($element))
                    @foreach ($element as $page => $url)
                        <li class="page-item {{ $paginator->currentPage() == $page ? 'active' : '' }}">
                            <a href="{{ $url }}" class="page-link">{{ $page }}</a>
                        </li>
                    @endforeach
                @endif
            @endforeach

            <!-- Next Page -->
            <li class="page-item {{ $paginator->hasMorePages() ? '' : 'disabled' }}">
                <a href="{{ $paginator->nextPageUrl() }}" class="page-link">
                    &raquo;
                </a>
            </li>

            <!-- Last Page -->
            @if ($paginator->currentPage() < $paginator->lastPage() - 1)
                <li class="page-item">
                    <a href="{{ $paginator->url($paginator->lastPage()) }}" class="page-link">Last</a>
                </li>
            @endif
        </ul>
    </nav>
@endif
