PGDMP  5    "                }            kswo_navi_rooms    17.2    17.2     �           0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                           false            �           0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                           false            �           0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                           false            �           1262    16388    kswo_navi_rooms    DATABASE     �   CREATE DATABASE kswo_navi_rooms WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'German_Switzerland.1252';
    DROP DATABASE kswo_navi_rooms;
                     postgres    false            �           0    0    DATABASE kswo_navi_rooms    ACL     <   GRANT CONNECT ON DATABASE kswo_navi_rooms TO readonly_user;
                        postgres    false    5777            �           0    0    SCHEMA public    ACL     /   GRANT USAGE ON SCHEMA public TO readonly_user;
                        pg_database_owner    false    7                        3079    16389    postgis 	   EXTENSION     ;   CREATE EXTENSION IF NOT EXISTS postgis WITH SCHEMA public;
    DROP EXTENSION postgis;
                        false            �           0    0    EXTENSION postgis    COMMENT     ^   COMMENT ON EXTENSION postgis IS 'PostGIS geometry and geography spatial types and functions';
                             false    2                        3079    17476    system_stats 	   EXTENSION     @   CREATE EXTENSION IF NOT EXISTS system_stats WITH SCHEMA public;
    DROP EXTENSION system_stats;
                        false            �           0    0    EXTENSION system_stats    COMMENT     V   COMMENT ON EXTENSION system_stats IS 'EnterpriseDB system statistics for PostgreSQL';
                             false    3            �            1259    17468    rooms    TABLE     �   CREATE TABLE public.rooms (
    id integer NOT NULL,
    name text NOT NULL,
    floor integer NOT NULL,
    geom public.geography(Point,4326),
    metadata jsonb,
    type character varying(50),
    teacher jsonb
);
    DROP TABLE public.rooms;
       public         heap r       postgres    false    2    2    2    2    2    2    2    2            �           0    0    TABLE rooms    ACL     5   GRANT SELECT ON TABLE public.rooms TO readonly_user;
          public               postgres    false    225            �            1259    17467    rooms_id_seq    SEQUENCE     �   CREATE SEQUENCE public.rooms_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 #   DROP SEQUENCE public.rooms_id_seq;
       public               postgres    false    225            �           0    0    rooms_id_seq    SEQUENCE OWNED BY     =   ALTER SEQUENCE public.rooms_id_seq OWNED BY public.rooms.id;
          public               postgres    false    224            �           2604    17471    rooms id    DEFAULT     d   ALTER TABLE ONLY public.rooms ALTER COLUMN id SET DEFAULT nextval('public.rooms_id_seq'::regclass);
 7   ALTER TABLE public.rooms ALTER COLUMN id DROP DEFAULT;
       public               postgres    false    225    224    225            �          0    17468    rooms 
   TABLE DATA           O   COPY public.rooms (id, name, floor, geom, metadata, type, teacher) FROM stdin;
    public               postgres    false    225   �       �          0    16711    spatial_ref_sys 
   TABLE DATA           X   COPY public.spatial_ref_sys (srid, auth_name, auth_srid, srtext, proj4text) FROM stdin;
    public               postgres    false    220   �!       �           0    0    rooms_id_seq    SEQUENCE SET     <   SELECT pg_catalog.setval('public.rooms_id_seq', 134, true);
          public               postgres    false    224            �           2606    17475    rooms rooms_pkey 
   CONSTRAINT     N   ALTER TABLE ONLY public.rooms
    ADD CONSTRAINT rooms_pkey PRIMARY KEY (id);
 :   ALTER TABLE ONLY public.rooms DROP CONSTRAINT rooms_pkey;
       public                 postgres    false    225            �   �  x��Z�r�F�]�_��c&bl��Xf&2%ے�!��b� "1,J�{��Ҏ?6'� A	pY1X����y�ܛ���R���3B��9�A���Y�-#�0Mr|4�B	r��7g/��ǏUӕ�;��N�'W�h(��"~�3>��g�6\���*��YN"t��g� �'�Y��������: �;�Wp
p���i�����@�`��p���@�Y�c��y�F�NVp�^���e��9p��5/�t10�F����*4¹��9��U�������~�ޗ�]uWvY��N����c�M֍�[�f f�k��Fb��M�MuWW�oM_u]}u�; (]5��ȸ,��o �������'�d� �*$�V�\?E���)��F��S&O�UP`	Թ�x����Ou���Cr|���l��qU�ի���H���'c5�x_.q'c��$��H���7SDEo��wvb�$�|��n	��vf��1�	�Uu�U�}}wWF�!��z�{*��4#^�S�s��^W���o��l������t.�UH�����m�����1-9"�����s�U"�9҅(
�����{�Ţe]/lR*�bA�H��)\-#}T%P�
�4U�97�z�)-��X_�	t�����JgGP�#�*<��uP�@�Y�E!�����K�r��8�� *VA���zUX2Q�/�i��@i���:��9����Y,Sh�%P�N�yM�{L!�"#R-Sh�'P�
j-����<":e?C �EE�t�⤍�MA�����z����o>�ۯ*�H!��9�A��(�\�����7��]y�׷c����t}���Ti��
DD�P��˫���M���^��&�?��6`����ً���n���W��벻����ޥ/�]�6���~__)R��u�<:�3ffsU0Q7��A��_Tmw��U�k���`X����!{Y7��tѷ]�4U�{{ݧ�����������p7ڛ���RD���3�P��X��S�^|����۲�V�f�U�҇?�z6{�����~0���}��&{	�|�}��]UW��×�)�k��������R5M�����KT���Ċl]��x�U�X�|�*,�Qu�U}���͹8{�W�D���2�|*�BE�"����gEyW5R��$e)�5�11I�Y��p�5D�z�R�p��y�阇"�����U�o=���������,�\Y�����-(콇)�W�R���R��4���D�S,mvy�{�e�$[P9����dAY�ԲZ%�� BLE6�;�����m �Բ�s��NN��3���)��#4�=���vհ_InpUn�R�����F,T/���;�(�2��~ߎIKԕ&U���k�4g�[��'�DK2����D�����C��}	U�HE�X������(B���{�4!��R�I�ѷ�U0��[���,!�7N�� Π����V��/?!����iI�G׻����{*A�E��G)�6ׇ�Sy�x�^2��LBY��Ѐp(���U�����n4OZK��ӓ�P�c�{�:�
�V ��@�?�U2�F1��^W�*ӛu�q�@�Lh|�A F���YI�j*BNP���(������>/�c�3@�-(��C��9��G|Y÷xB��s��֨@�VSz���N��{Z��5t��}��Ӆc�C�H���n��)3{w���3}��á��'���2�L�:p�Wʦ.��m{u�>�����H�oJ������( �*�A��5�M�(�p��}U��/m��L�����>��EA��c2{N���\/��kD�0G�)��:g���FM�2xu��ll2�H��d
�$��V��}��8~������e������q�����T������Q6�隫���賢�����Uv�����&MotZ�:	����=�JD�<F�.���������.�p�t��%�2���R;���X��a��L~�r�ş�1 ���m��5h�o�$W��:����5VGt�c��B.����[u�07�/��yK���h���S�������uy	�c�����S}�����
�Q��0h�&r��s��FW�-�
	��D�k�%����qU�MԿ1�ʝuT(��<<P��=�E]�S&
�;(F2Kn�D�.5M����nUSC�@q4�S�T�4�(ٰ�Z=�i��\���-%ix�m]<A�(�e���%K��}{���l6-9�@b��5�i�
�����Z��\w�� \*�<W��H�3��e�J��ɱX�c$���K����ǁ��	q=sH��"�\�G�Nj�v�:M=�>2�ك�k0qCm9�<���g�]�Q�L��_ۏ �a��o�]���K79�?�����P�B�h�8)\"��(-�c͕I�vw=1��,ݏ�S=�Y��-�zVy��A=��nz[���m~:??O4Ӣ��v�(�j2{�d�0��@���_C�\�K�W�B�t�KY�8�y"Zw��i(m8�x5L*�Q��$���ϽHS�����m]����tF�f� "��OP@����@|��`ұ8�e�}C`>|}�R߃��4F�o�	��g�4.�߷}_��m����A/A@� M�M����ӽ�@��vO�褫QU���C7AU�jR�m��)T8'�g�tB8ŗ���P�_�>�Ǯi��E�V��ß�n?���	���\���k�n`�v$3�!;#��nL�F\�]����qg�#�+6}?o�>���������[�:B�T��xq\�Jv"���+UbmN��Y�$�ώ8f���OA~<j\�-57��0�b������?�n�7 �&�*������ϻ����~)����d��T�]�G=^��gǵߺà!�D��q6+�'~���E�[l���r�'��i]P�ar/d����p��PtÝc���Tt�o�)�����ݱ�l���k����R	���S:��������
�w�A(���U&y��q��T�
\� ��!�a��V���S�C�4��t��1�W\����NU{�F`��)H:��[�#*��d��>N��@�	u}<�x��м�%������U:V�[�@J���� $L3�$��Io:��['UJz�]����གJ�LD�ۭC5�JA�LiM�E�VmL�C ���ɋ�#��U(st���<�O���O3_�uZ�E�q��(,����R:�[�@�����bjR ��S�Q:�[g6�kU�$Ar��!�76<��֠e�y��l���z����K�{l�ԭ����F?�]PL9zГ����u��ˍ�9�ô����݋��G<˪d�ƙ�X�f~���$'ρSI���K�=��0�kp�[��s����~8��m��E���߶�+⡯��S;��x����w�1�9G�x9��\h�p�7t�n�|7�3E�c�&�A��N�N�a%=C�f�KL0���թD�i��ѳBpĐB5̠�
f�:�&I����=Zi?�"��d�d���w�r	���`
7�j84�,_��;v�M��/�9{���4��2ک������'46�ѳw=P�9
n:�7�(�Yud��h�̭��r� )�{U��T��i���R~��W�/I��̏ـ�X0��6�T����h ���������\C�V�����]������La�@��Ű3Ę�D��H�r��.{�7�C����7�h��	�SCP�(���r���\��k��5�z�Ud+����x�@�v��k�1��U4�6��3����|5�_ 8�C7���ғC��a	��:(�\�-��h�z�
�3;z�QJ��_��P��~�lӤS���F�c��'ձ���:5�hJ��+�����\_W��O���<���o�����Rk��Dg|��>FM�K�f٫��=Mد��U�h�߶ ���>~z��L�L\�����T�ϩ����5{7��ZU�V�S��9��Xx{��?���J������uO]|���E_��&[��g���������u �      �      x������ � �     