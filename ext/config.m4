PHP_ARG_ENABLE(mediatrix,
    [Whether to enable the "mediatrix" extension],
    [  --enable-mediatrix      Enable "mediatrix" extension support])

if test $PHP_VEHICLES != "no"; then
    PHP_REQUIRE_CXX()
    PHP_SUBST(MEDIATRIX_SHARED_LIBADD)
    PHP_ADD_LIBRARY(stdc++, 1, MEDIATRIX_SHARED_LIBADD)
    PHP_NEW_EXTENSION(mediatrix, mediatrix.cpp DMX.cpp, $ext_shared)
fi
