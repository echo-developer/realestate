import axios from 'axios';
import { useState, useEffect, useCallback, useRef } from 'react';

const useFetch = ({ api = '', deps = [], resetPageOnDepsChange = false }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [response, setResponse] = useState(null);
  const [errors, setErrors] = useState(null);
  const [page, setPage] = useState(1);
  const [showLoadMoreBtn, setShowLoadMoreBtn] = useState(false);

  const prevDepsRef = useRef(deps);
  const shouldResetPageRef = useRef(false);

  const fetchData = useCallback(async (showLoading = true) => {
    const authToken = JSON.parse(localStorage?.getItem('user')) || '';
    const headers = authToken ? { Authorization: `Bearer ${authToken}` } : {};
    let apiUrl = api;

    if (page > 1) {
      if(apiUrl?.includes("?")) {
        apiUrl += `&page=${page}`;
      }else {
        apiUrl += `?page=${page}`;
      }
    }

    if (page === 1 && showLoading) {
      setLoading(true);
    }

    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}${apiUrl}`, { headers });

      if (res?.data?.status === 1) {
        if (page > 1) {
          setData(prev => [...(prev || []), ...(res.data?.data || [])]);
        } else {
          setData(res.data?.data);
        }

        setResponse(res);

        const meta = res?.data?.meta;
        setShowLoadMoreBtn(meta?.current_page < meta?.last_page);
      }
    } catch (error) {
      setErrors({ message: error?.message });
    } finally {
      setLoading(false);
    }
  }, [api, page]);

  useEffect(() => {
    if (resetPageOnDepsChange) {
      const depsChanged = deps.some((dep, i) => dep !== prevDepsRef.current[i]);
      if (depsChanged) {
        prevDepsRef.current = deps;
        shouldResetPageRef.current = true;
        setPage(1);
        return;
      }
    }
  }, [deps, resetPageOnDepsChange]);

  useEffect(() => {
    if (typeof window === 'undefined' || !api) return;

    if (shouldResetPageRef.current) {
      if (page === 1) {
        shouldResetPageRef.current = false;
        fetchData();
      }
    } else {
      fetchData();
    }
  }, [fetchData, page, api]);

  const reFetch = (showLoading = true) => {
    fetchData(showLoading);
  };

  const loadMore = () => {
    setPage(prev => prev + 1);
  };

  return {
    data,
    setData,
    loading,
    setLoading,
    errors,
    setErrors,
    reFetch,
    response,
    page,
    loadMore,
    showLoadMoreBtn,
  };
};

export default useFetch;
