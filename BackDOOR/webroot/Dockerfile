FROM php:8.3-cli

RUN useradd -r -u 1001 -m -d /home/labrunner -s /usr/sbin/nologin labrunner

WORKDIR /app

COPY --chown=root:root . /app

RUN echo 'expose_php = Off' > /usr/local/etc/php/conf.d/hardening.ini

# files/ is writable so uploads land here
RUN mkdir -p /app/files \
    && chown -R labrunner:labrunner /app/files \
    && chmod 755 /app/files

# secret/ is readable but never writable — flag lives here
RUN mkdir -p /app/files/secret/nothing \
    && chown -R root:root /app/files/secret \
    && chmod -R 755 /app/files/secret

# Lock down everything else
RUN chmod -R a-w /app \
    && chmod -R u+w /app/files \
    && chmod -R a-w /app/files/secret

# Sticky bit — labrunner can create files in files/ but cannot
# delete or rename files it doesn't own (other uploads)
RUN chmod +t /app/files

# Block ONLY filesystem-destructive PHP functions.
# system/exec/shell_exec/passthru are kept ON purpose —
# the uploaded webshell needs them to run commands.
# unlink/rename/rmdir are disabled so an uploaded shell
# cannot delete files even if it tries.
RUN { \
      echo 'disable_functions = unlink,rename,rmdir,copy,mkdir,chmod,chown,chgrp'; \
    } >> /usr/local/etc/php/conf.d/hardening.ini

USER labrunner

EXPOSE 10000
CMD ["sh", "-c", "php -S 0.0.0.0:${PORT:-10000} router.php"]
